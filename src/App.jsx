import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ScannerScreen from "./ScannerScreen";
import EggPage from "./Egg";
import MonsterPage from "./Monsters";
import Store from "./Store";
import CreatorMode from "./CreatorMode"; // adjust path if it's in a subfolder
import DevTools from "./pages/DevTools";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/scanner" element={<ScannerScreen />} />
        <Route path="/egg" element={<EggPage />} />
        <Route path="/monsters" element={<MonsterPage />} />
        <Route path="/store" element={<Store />} />
        <Route path="/creator" element={<CreatorMode />} />
        <Route path="/dev" element={<DevTools />} />
      </Routes>
    </Router>
  );
}



export default App;
