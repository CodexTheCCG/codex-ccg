import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ScannerScreen from "./ScannerScreen";
import EggPage from "./Egg";
import MonsterPage from "./Monsters";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/scanner" element={<ScannerScreen />} />
        <Route path="/egg" element={<EggPage />} />
      </Routes>
    </Router>
  );
}

<Route path="/monsters" element={<MonsterPage />} />

export default App;
