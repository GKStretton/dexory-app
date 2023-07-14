import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { useReward } from "react-rewards";

function App() {
  const { reward, isAnimating } = useReward("balloonSrc", "balloons", {
    elementCount: 4,
    startVelocity: 5,
    lifetime: 800,
  });

  // balloons on mount
  useEffect(() => {
    reward();
  }, []);

  return (
    <div className="App">
      <Dashboard />
      <div id="balloonSrc"></div>
    </div>
  );
}

export default App;
