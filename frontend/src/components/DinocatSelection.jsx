// DinocatSelection.jsx
import React, { useState, useEffect } from 'react';
import DinocatCard from './DinocatCard';
import '../css/dinocats.css';

export default function DinocatSelection({ onSelect }) {
  const [dinocats, setDinocats] = useState([]);

  useEffect(() => {
    // Aqui você faria a requisição à API para buscar os dinocats
    fetch('http://localhost:5000/dinocats')
      .then(res => res.json())
      .then(data => setDinocats(data));
  }, []);

  const handleChoose = (dino) => {
    onSelect(dino); // Passa o dino escolhido para o componente pai
  };

  return (
    <div className="dinocat-selection-container">
      {dinocats.map(dino => (
        <DinocatCard
          key={dino.id}
          dino={dino}
          onChoose={handleChoose}
        />
      ))}
    </div>
  );
}
