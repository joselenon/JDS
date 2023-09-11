import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Jackpot from '../pages/Jackpot';
import Profile from '../pages/Profile';
import Termos from '../pages/Termos';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jackpot" element={<Jackpot />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/termos" element={<Termos />} />
    </Routes>
  );
}
