// DinocatSelection.jsx
import React, { useState, useEffect } from 'react';
import DinocatCard from './DinocatCard';
import '../css/dinocats.css';

export default function DinocatSelection({ user, socket, battleId, onChoose, selectedDinocat, onBothReady }) {
  const [dinocats, setDinocats] = useState([]);
  const [ready, setReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);

  // ------------------------------
  // Carrega Dinocats do jogador
  // ------------------------------
  useEffect(() => {
    if (!user) return;

    const loadDinocats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${user.id}/dinocats`);
        const data = await res.json();
        if (Array.isArray(data)) setDinocats(data);
        else if (Array.isArray(data.rows)) setDinocats(data.rows);
        else setDinocats([]);
      } catch (err) {
        console.error('Erro ao carregar dinocats:', err);
        setDinocats([]);
      }
    };

    loadDinocats();
  }, [user]);

  // ------------------------------
  // Conecta à sala e escuta eventos do Socket
  // ------------------------------
  useEffect(() => {
    if (!socket || !battleId || !user) return;

    // Entra na sala
    socket.emit('joinBattleRoom', { battleId, userId: user.id });
    console.log('Solicitei joinBattleRoom:', battleId, user.id);

    // Quando o oponente ficar ready
    const handleOpponentReady = ({ userId: readyUserId, dinocat }) => {
      if (readyUserId !== user.id) {
        setOpponentReady(true);
        console.log('Oponente está ready com:', dinocat);
      }
    };

    // Quando ambos ficarem ready
    const handleBothReady = () => {
      console.log('Ambos estão ready! Avançando para a batalha...');
      if (typeof onBothReady === 'function') onBothReady();
    };

    socket.on('opponentReady', handleOpponentReady);
    socket.on('bothReady', handleBothReady);

    return () => {
      socket.off('opponentReady', handleOpponentReady);
      socket.off('bothReady', handleBothReady);
    };
  }, [socket, battleId, user?.id, onBothReady]);

  // ------------------------------
  // Seleção de Dinocat
  // ------------------------------
  const handleChoose = (dino) => {
    if (typeof onChoose === 'function') onChoose(dino);
    if (battleId && socket) {
      socket.emit('dinocatSelected', { roomId: battleId, dinocat: dino });
      console.log('Dinocat selecionado enviado:', dino, 'para room', battleId);
    }
  };

  // ------------------------------
  // Ready do jogador
  // ------------------------------
  const handlePlayerReady = () => {
    if (!selectedDinocat) return alert('Escolha um Dinocat primeiro!');
    setReady(true);
    socket.emit('playerReady', { battleId, userId: user.id, dinocat: selectedDinocat });
    console.log('Enviei playerReady com:', selectedDinocat);
  };

  // ------------------------------
  // JSX
  // ------------------------------
  return (
    <div className="dinocat-selection-container">
      <h2>Selecione seu Dinocat</h2>
      <div className="dinocat-list">
        {dinocats.map((dino) => (
          <DinocatCard key={dino.id} dino={dino} onChoose={handleChoose} />
        ))}
      </div>

      <button onClick={handlePlayerReady} disabled={ready}>
        {ready ? 'Ready!' : 'Clique para Ready'}
      </button>

      <div className="status">
        {ready && <p>Você está pronto ✅</p>}
        {opponentReady && <p>Oponente está pronto ✅</p>}
      </div>
    </div>
  );
}
