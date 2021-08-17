import Home from './screens/Home';
import { LandingBg } from './screens/HomeComponents';

function App() {
  return (
    <div className="App">
      <div style={{ position: "fixed", zIndex: "-10", overflow: "hidden", width: "100wh", height: "100vh" }}>
        <LandingBg />
      </div>
      <Home />
    </div>
  );
}

export default App;
