// DinocatSelection.jsx
import React, { useState, useEffect } from 'react';
import DinocatCard from './DinocatCard';
import '../css/dinocats.css';

export default function DinocatSelection({ user, onChoose }) {
  const [dinocats, setDinocats] = useState([]);

  // Substitua o useEffect atual por este bloco
useEffect(() => {
  if (!user) return;

  // função async para facilitar await/try-catch
  const load = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}/dinocats`);
      const data = await res.json();

      // POSSÍVEIS formatos esperados da API:
      // 1) Array direto -> data = [ ... ]
      // 2) Objeto com rows -> { rows: [...] }
      // 3) Objeto com data -> { data: [...] }
      // 4) Objeto único -> { id: 1, name: 'x' } (não é lista)

      if (Array.isArray(data)) {
        setDinocats(data);
      } else if (Array.isArray(data.rows)) {
        setDinocats(data.rows);
      } else if (Array.isArray(data.data)) {
        setDinocats(data.data);
      } else {
        // fallback: se veio um único item, transforma em array; se for inesperado, zera
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          // converte objeto único em array (para evitar crash no .map)
          setDinocats([data]);
        } else {
          setDinocats([]); // garante que dinocats seja sempre array
        }
        console.warn("Resposta inesperada ao buscar dinocats:", data);
      }
    } catch (err) {
      console.error("Erro ao carregar dinocats:", err);
      setDinocats([]); // evita crash caso a requisição falhe
    }
  };

  load();
}, [user]);


  const handleChoose = (dino) => {
    if(typeof onChoose === "function") onChoose(dino); // Passa o dino escolhido para o componente pai
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
