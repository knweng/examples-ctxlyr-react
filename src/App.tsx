import {
	$,
	Chat,
	ChatLayer,
	useSelect,
	useStore,
	useWatch,
} from "@ctxlyr/react/use"

export const StoreLayer = () => {
	return (
		<ChatLayer context={{ chatMessages: [] }}>
			<main>
				<ChatView />
			</main>
		</ChatLayer>
	)
}

const ChatView: React.FC = () => {
	const { context } = useStore(Chat)
	const chatMessages = useWatch(context.chatMessages$)

	return (
		<div className="example-app">
			<ul>
				{chatMessages.map((msg) => (
					<li key={msg}>{msg}</li>
				))}
			</ul>
			<MessageInput />
		</div>
	)
}

const MessageInput: React.FC = () => {
	const { slice$ } = useStore(Chat)
	const currentSlice = useWatch(slice$)

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
	const ctx = useSelect(context, $("responseBuffer"))

	return <output>{ctx.responseBuffer}</output>
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
