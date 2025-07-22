import "./lib/global.css"
import "./lib/style.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { StoreLayer } from "./App.tsx"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<div className="example-showcase">
			<StoreLayer />
		</div>
	</StrictMode>,
)
