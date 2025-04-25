import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Publications from './pages/publications.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/publications" element={<Publications />} />
      </Routes>
    </div>
  );
}

export default App;
