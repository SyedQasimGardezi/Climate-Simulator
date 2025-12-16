import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TrackActivity from './pages/TrackActivity';
import History from './pages/History';
import Recommendations from './pages/Recommendations';
import ClimateSimulator from './pages/ClimateSimulator';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/track" element={<TrackActivity />} />
          <Route path="/history" element={<History />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/simulator" element={<ClimateSimulator />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
