import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { TodoPage } from './pages/TodoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<Navigate to={`/${crypto.randomUUID()}`} />} />
        <Route path="/:id" element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;