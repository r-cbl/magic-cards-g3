import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ViewPublications from './components/viewPublications/viewPublications.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/publications" element={<ViewPublications />} />
      </Routes>
    </div>
  );
}

export default App;
