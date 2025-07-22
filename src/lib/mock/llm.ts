export const mockApi = {
	streamChat: (messages: Array<string>) => {
		return {
			textStream: (async function* () {
				const lastMessage = messages[messages.length - 1]?.toLowerCase() || ""

				let response = `I understand you're asking about: ${lastMessage}. `

				if (lastMessage.includes("hello") || lastMessage.includes("hi")) {
					response = "Hello! How can I help you today? "
				} else if (lastMessage.includes("weather")) {
					response =
						"The weather is looking great today! It's sunny with a light breeze. "
				} else if (lastMessage.includes("help")) {
					response = "I'm here to help! What would you like to know? "
				} else {
					response =
						"That's an interesting question. Let me think about that... "
				}

				response += "Is there anything specific you'd like me to elaborate on?"

				const words = response.split(" ")

				for (let i = 0; i < words.length; i++) {
					const chunk = (i === 0 ? "" : " ") + words[i]

					await new Promise((resolve) =>
						setTimeout(resolve, 50 + Math.random() * 100),
					)

					yield chunk
				}
			})(),
		}
	},
}
