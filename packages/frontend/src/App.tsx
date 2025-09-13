import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Game } from './pages/Game';
import { Skateparks } from './pages/Skateparks';
import { MySpots } from './pages/MySpots';
import { Tutorials } from './pages/Tutorials';
import { Profile } from './pages/Profile';
import { Ranking } from './pages/Ranking'; // ✅ NOVA ROTA
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/game" element={<Game />} />
            <Route path="/skateparks" element={<Skateparks />} />
            <Route path="/my-spots" element={<MySpots />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ranking" element={<Ranking />} /> {/* ✅ NOVA ROTA */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Bottom Navigation */}
          <Routes>
            <Route path="/" element={<BottomNavigation />} />
            <Route path="/skateparks" element={<BottomNavigation />} />
            <Route path="/my-spots" element={<BottomNavigation />} />
            <Route path="/game" element={<BottomNavigation />} />
            <Route path="/tutorials" element={<BottomNavigation />} />
            <Route path="/profile" element={<BottomNavigation />} />
            <Route path="/ranking" element={<BottomNavigation />} /> {/* ✅ NOVA ROTA */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;