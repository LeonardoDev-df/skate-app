import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Skateparks } from './pages/Skateparks';
import { Tutorials } from './pages/Tutorials';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/skateparks" element={<Skateparks />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;