import type { $ } from "@ctxlyr/react"

/* Define strongly-typed store model with $.Model
 * - first param: store structure with slices
 * - second param: initial slice path
 */
export type ChatModel = $.Model<Store, "Compose">

/* $.Store defines the complete state tree structure
 * - each key becomes a slice path: "Compose" | "Generate"
 * - slices can have nested sub-slices for complex flows
 */
type Store = $.Store<{
	/* $.Slice bundles context, actions, and sub-slices */
	Compose: $.Slice<
		[
			/* $.Context defines guaranteed shape of slice data
			 * - all properties become observables with $ suffix
			 * - available via: useStore(Chat, "Compose").context
			 */
			$.Context<{ chatMessages: Array<Message>; threadTitle: string }>,
			/* $.Action maps action names to payload types
			 * - dispatched from components: action.sendMessage("hello")
			 * - used for building the action reducer
			 */
			$.Action<{ sendMessage: string; updateTitle: string }>,
		]
	>
	Generate: $.Slice<
		[
			/* Context inheritance from parent slices
			 * - `chatMessages` and `threadTitle` inherited from root
			 * - `newMessage` and `responseBuffer` added for streaming
			 */
			$.Context<{
				chatMessages: Array<Message>
				threadTitle: string
				newMessage: Message
				responseBuffer: string
			}>,
			/* Actions available in parent propagate to sub-slices
			 * - `updateTitle` accessible in all Generate.* slices
			 */
			$.Action<{ updateTitle: string }>,
			/* $.SubSlice creates nested slice paths
			 * - paths become: "Generate.Stream" | "Generate.Error"
			 * - enables granular UI state modeling
			 */
			$.SubSlice<{
				/* $.OnEntry marks slices that execute logic on entry
				 * - triggers Action.onEntry() handler automatically
				 * - useful for async operations and side effects
				 */
				Stream: $.Slice<[$.OnEntry]>
				/* Error recovery slice with specific context and actions
				 * - extends parent context with error-specific data
				 * - provides scoped actions for error handling
				 */
				Error: $.Slice<
					[
						$.Context<{ errorMsg: string }>,
						$.Action<{ reset: void; retry: void }>,
					]
				>
			}>,
		]
	>
}>

export type Message = string
export type ResponseBuffer = string
