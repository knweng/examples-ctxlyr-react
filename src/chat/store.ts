import { mockApi } from "@/lib/mock/llm.ts"
import {
	$peek,
	$setImmediate,
	Action,
	Layer,
	type Observable,
	Store,
} from "@ctxlyr/react"
import type { ChatModel, Message, ResponseBuffer } from "./model.ts"

export const Chat = Store.type<ChatModel>().make(
	Store.initial("Compose"),
	Store.actions(
		Action.when("sendMessage", ({ to, payload }) =>
			to.slice("Generate.Stream", { newMessage: payload, responseBuffer: "" }),
		),
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
		Action.when("retry", ({ to, context }) => {
			$peek(context.chatMessages$).pop()
			return to.slice("Generate.Stream")
		}),
		Action.when("reset", ({ to, context }) => {
			$peek(context.chatMessages$).pop()
			return to.slice("Compose")
		}),
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
		$setImmediate(responseBuffer$, buffer)
	}

	throw Error("LLM API Overloaded")
}

export const ChatLayer = Layer.makeProvider(Chat)
