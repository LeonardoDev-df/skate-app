import React from 'react'
import './index.css'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#1a1a1a',
          marginBottom: '1rem'
        }}>
          🛹 Skate App
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '2rem'
        }}>
          Frontend funcionando! 🚀
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem'
        }}>
          <span style={{
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}>Game of Skate</span>
          <span style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}>Mapa de Pistas</span>
          <span style={{
            backgroundColor: '#f3e8ff',
            color: '#7c3aed',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}>Tutoriais</span>
          <span style={{
            backgroundColor: '#fed7aa',
            color: '#ea580c',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}>Perfil</span>
        </div>
      </div>
    </div>
  )
}

export default App