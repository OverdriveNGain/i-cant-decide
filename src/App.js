import Home from './screens/Home';
import { LandingBg } from './screens/HomeComponents';

function App() {
  return (
    <div className="App">
      <div className="non-footer-content">
        <div style={{ position: "fixed", zIndex: "-10", overflow: "hidden", width: "100wh", height: "100vh" }}>
          <LandingBg />
        </div>
        <Home />
      </div>
      <footer>
        <p className="text-center text-muted"><a href="https://www.jeremyamon.com">www.jeremyamon.com</a></p>
      </footer>

    </div>
  );
}

export default App;
