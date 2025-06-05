import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ScannerScreen from "./ScannerScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/scanner" element={<ScannerScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
