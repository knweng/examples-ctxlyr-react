# Usage example: @ctxlyr/react

Basic usage with text streaming and error handling.

<div align="center">

[@ctxlyr/react API Documentation](https://github.com/ctxlyr/react?tab=readme-ov-file#-usage) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/knweng/examples-ctxlyr-react)

</div>

| Src File        | Description|
| --------------- | ----------- |
| `chat/model.ts` | TypeScript type definitions for chat state model using @ctxlyr/react with slices for Compose and Generate states |
| `chat/store.ts` | Main chat store implementation with actions for sending messages, streaming responses, and error handling |
| `ctxlyr.ts`     | Re-exports @ctxlyr/react hooks and chat store components for easy importing |
| `App.tsx`       | React components for chat UI including message list, input form, streaming view, and error handling |

| TSX Component| Description|
| --------------- | ----------- |
| `StoreLayer` | Root component that provides ChatLayer context with initial chat messages array |
| `ChatView` | Displays chat messages list and renders MessageInput component |
| `MessageInput` | Route component that renders different views based on current chat slice state |
| `ComposeView` | Form component for composing and sending new messages |
| `StreamingView` | Displays real-time streaming response buffer during message generation |
| `ErrorView` | Error handling component with retry/reset actions and response buffer display |
