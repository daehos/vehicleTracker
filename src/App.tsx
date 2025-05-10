import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

// import VehicleDetail from "./pages/VehicleDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/vehicle/:id" element={<VehicleDetail />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
