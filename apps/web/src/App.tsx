// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { Code } from "@repo/ui/code";
import "./App.css";
function App() {

  return (
    <>
      <div className="text-3xl font-bold underline bg-blue-50">Hello World!!</div>
      <Code children={"hi"}></Code>
    </>
  );
}

export default App;
