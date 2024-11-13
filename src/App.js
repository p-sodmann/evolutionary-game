// src/App.js
import React from 'react';
import GameCanvas from './components/GameCanvas/GameCanvas';
import ControlPanel from './components/ControlPanel/ControlPanel';
import StatisticsPanel from './components/StatisticsPanel/StatisticsPanel';
import Footer from './components/Footer/Footer';
import './App.css';



function App() {
  return (
    <div className="app">
      <StatisticsPanel />
      <GameCanvas />
      <ControlPanel />
      <Footer />
    </div>
  );
}

export default App;
