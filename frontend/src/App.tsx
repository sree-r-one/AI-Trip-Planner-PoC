import React from "react";
import { Routes, Route } from "react-router";
import { Home, About } from "./pages";
const App: React.FC = () => {
  return (
    <div className="">
      Dashboard
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};

export default App;
