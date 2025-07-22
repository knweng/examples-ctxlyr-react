import { mockApi } from "@/lib/mock/llm.ts"
import {
	$peek,
	$set,
	$setImmediate,
	Action,
	Layer,
	type Observable,
	Store,
} from "@ctxlyr/react"
import type { ChatModel, Message, ResponseBuffer } from "./model.ts"

/* Create store from `ChatModel` type definition
 * - Store.type<T>() provides TypeScript inference for the model
 * - Store.initial() sets the starting slice path
 */
export const Chat = Store.type<ChatModel>().make(
	Store.initial("Compose"),
	Store.actions(
		/* Handle "sendMessage" action from "Compose" slice
		 * - `to.slice()` transitions to target slice with required context delta
		 * - TypeScript enforces required properties: newMessage, responseBuffer
		 */
		Action.when("sendMessage", ({ to, payload }) =>
			to.slice("Generate.Stream", { newMessage: payload, responseBuffer: "" }),
		),
		/* Execute async side effects when entering "Generate.Stream" slice
		 * - Access current context values with $peek() for non-reactive reads
		 * - Return `to.slice()` to transition after async completion
		 */
		Action.onEntry("Generate.Stream", async ({ to, context }) => {
			const { chatMessages, newMessage } = $peek(context)
			chatMessages.push(newMessage)

			try {
				await streamResponseWithThrow(chatMessages, context.responseBuffer$)
				return to.slice("Compose")
			} catch (e) {
				const errorMsg = (e as Error).message
				return to.slice("Generate.Error", { errorMsg })
			}
		}),
		/* Handle "retry" action from "Generate.Error" slice
		 * - Mutate context directly with $peek() for arrays/objects
		 * - Transition back to streaming slice for retry attempt
		 */
		Action.when("retry", ({ to, context }) => {
			$peek(context.chatMessages$).pop()
			return to.slice("Generate.Stream")
		}),
		Action.when("reset", ({ to, context }) => {
			$peek(context.chatMessages$).pop()
			return to.slice("Compose")
		}),
		/* Update context without slice transition
		 * - Return $set() to apply observable updates
		 * - Available in all slices due to parent context inheritance
		 */
		Action.when("updateTitle", ({ context, payload }) =>
			$set(context.threadTitle$, payload),
		),
		/* Required marker ensuring all declared actions are handled */
		Action.exhaustive,
	),
)

const streamResponseWithThrow = async (
	chatMessages: Message[],
	responseBuffer$: Observable<ResponseBuffer>,
) => {
	const { textStream } = mockApi.streamChat(chatMessages)

	let buffer = ""
	for await (const textPart of textStream) {
		buffer += textPart
		/* Update observable during async iteration
		 * - $setImmediate() bypasses batching updates
		 */
		$setImmediate(responseBuffer$, buffer)
	}

	throw Error("LLM API Overloaded")
}

/* Generate Layer provider component for `Chat` store
 * - Automatically typed from store model definition
 * - Provides React context boundary for child components
 */
export const ChatLayer = Layer.makeProvider(Chat)
