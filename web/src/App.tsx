// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { Code } from "../src/components/code";
import "./App.css";
import LoginForm from "./components/LoginForm";
function App() {

  return (
    <>
      <div className="text-3xl font-bold underline bg-blue-50">Hello World!!</div>
      <Code children={"hi"}></Code>
      <h1>Hello</h1>
      <LoginForm></LoginForm>
    </>
  );
}

export default App;
