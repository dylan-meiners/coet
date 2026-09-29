import "./App.css";
import { OrbitVisualizer } from "./components/OrbitVisualizer";

function App() {
  return (
    <div className="App">
      <div className="header"></div>
      <div className="nav"></div>
      <div className="content">
        <OrbitVisualizer />
      </div>
    </div>
  );
}

export default App;
