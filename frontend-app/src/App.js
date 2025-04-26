import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ViewPublications from './components/viewPublications/viewPublications.jsx';
import NavBar from './components/navBar/navBar.jsx';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/publications" element={<ViewPublications />} />
      </Routes>
    </div>
  );
}

export default App;
