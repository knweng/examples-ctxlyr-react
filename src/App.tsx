import {
	$, // utility for bulk observable selection
	Chat, // from: ./chat/store.ts
	ChatLayer, // from: ./chat/store.ts
	useSelect, // subscribe to multiple observables
	useStore, // access store context & actions
	useWatch, // subscribe to single observable
} from "@ctxlyr/react/use" /* ctxlyr.ts */

export const StoreLayer = () => {
	/* Provide initial slice `context`
	 * - initial slice selected with: Store.initial("Compose")
	 * - `context` type defined with: $.Context<{ chatMessages: Array<Message>; threadTitle: string }>
	 */

	return (
		<ChatLayer context={{ chatMessages: [], threadTitle: "editable title" }}>
			<main>
				<ChatView />
			</main>
		</ChatLayer>
	)
}

const ChatView: React.FC = () => {
	// Provide `Chat` to access store props
	const { context, action } = useStore(Chat)

	/* Subscribe to value changes of selected observables
	 * - accessible `context` observables: chatMessages$ | threadTitle$
	 */
	const ctx = useSelect(context, $("chatMessages", "threadTitle"))

	return (
		<div className="example-app">
			<input
				defaultValue={ctx.threadTitle}
				onChange={(e) => action.updateTitle(e.target.value)}
			/>
			<div>{ctx.threadTitle}</div>
			<ul>
				{ctx.chatMessages.map((msg) => (
					<li key={msg}>{msg}</li>
				))}
			</ul>
			<MessageInput />
		</div>
	)
}

const MessageInput: React.FC = () => {
	/* `slice$` can be any leaf slice path */
	const { slice$ } = useStore(Chat)

	const currentSlice = useWatch(slice$) // "Compose" | "Generate.Stream" | "Generate.Error"

	switch (currentSlice) {
		case "Compose":
			return <ComposeView />
		case "Generate.Stream":
			return <StreamingView />
		case "Generate.Error":
			return <ErrorView />
	}
}

const ComposeView: React.FC = () => {
	/* Scope slice to "Compose" to access slice specific store props
	 * - `action` handlers scoped to: sendMessage | updateTitle
	 */
	const { action } = useStore(Chat, "Compose")

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				const formData = new FormData(e.currentTarget)
				const message = formData.get("new-message") as string
				action.sendMessage(message)
			}}
		>
			<textarea name="new-message" />
			<button type="submit">Send</button>
		</form>
	)
}

const StreamingView: React.FC = () => {
	const { context } = useStore(Chat, "Generate.Stream")

	/* Subscribe to value changes of a single observable */
	/* Direct access nested `context` observables */
	const responseBuffer = useWatch(context.responseBuffer$)

	return <output>{responseBuffer}</output>
}

const ErrorView: React.FC = () => {
	const { context, action } = useStore(Chat, "Generate.Error")
	const ctx = useSelect(context, $("errorMsg", "responseBuffer"))

	return (
		<section>
			<header>
				<p>Mock Error: {ctx.errorMsg}</p>
				<nav>
					<button onClick={action.retry}>Retry</button>
					<button onClick={action.reset}>Reset</button>
				</nav>
			</header>
			<output>{ctx.responseBuffer}</output>
		</section>
	)
}
