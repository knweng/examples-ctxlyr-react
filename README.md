# Usage example: @ctxlyr/react

Basic usage with text streaming and error handling.

<div align="center">

[@ctxlyr/react API Documentation](https://github.com/ctxlyr/react?tab=readme-ov-file#-usage) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/knweng/examples-ctxlyr-react)

</div>

| Src File        | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `chat/model.ts` | Models the app state tree with utility `type $`                                 |
| `chat/store.ts` | Runtime: Builds an exhaustive action reducer with the type from `chat/model.ts` |
| `ctxlyr.ts`     | Exports ctxlyr hooks and declared stores for import alias `"@ctxlyr/react/use"` |
| `App.tsx`       | Uses hooks from "@ctxlyr/react/use": `useStore`, `useWatch`, `useSelect`, `$`   |

| TSX Component   | Description                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `StoreLayer`    | Initializes the store-specific bounded context required by `useStore`                           |
| `ChatView`      | Combines `useSelect` with `$()` utility to subscribe to multiple observables in one declaration |
| `MessageInput`  | Demonstrates `useWatch` on `slice$` observable for component routing based on current state     |
| `ComposeView`   | Shows slice-scoped `useStore(Chat, "Compose")` returning only relevant `action` handlers        |
| `StreamingView` | Accesses deeply nested observables, like `context.responseBuffer$`, for fine-grain reactivity   |
| `ErrorView`     | Error recovery with slice-specific actions `retry` and `reset`                                  |

## Store Transitions

### Chat

| Current Slice       | Target Slice        | Action        |
| ------------------- | ------------------- | ------------- |
| `"Compose"`         | `"Generate.Stream"` | `sendMessage` |
| `"Generate.Stream"` | `"Compose"`         | `onEntry`     |
| `"Generate.Stream"` | `"Generate.Error"`  | `onEntry`     |
| `"Generate.Error"`  | `"Generate.Stream"` | `retry`       |
| `"Generate.Error"`  | `"Compose"`         | `reset`       |
