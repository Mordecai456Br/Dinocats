// DinocatSelection.jsx
import React, { useState, useEffect } from 'react';
import DinocatCard from './DinocatCard';
import '../css/dinocats.css';

export default function DinocatSelection({ user, socket, battleId, onChoose, selectedDinocat, onBothReady }) {
  // Lista de Dinocats do jogador
  const [dinocats, setDinocats] = useState([]);

  // Estado de readiness
  const [ready, setReady] = useState(false);          // se o jogador clicou "Ready"
  const [opponentReady, setOpponentReady] = useState(false); // se o oponente está ready

  // ------------------------------
  // Carrega Dinocats do jogador
  // ------------------------------
  useEffect(() => {
    if (!user) return;

    const loadDinocats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${user.id}/dinocats`);
        const data = await res.json();

        // Garante que sempre teremos um array para map
        if (Array.isArray(data)) setDinocats(data);
        else if (Array.isArray(data.rows)) setDinocats(data.rows);
        else if (Array.isArray(data.data)) setDinocats(data.data);
        else if (data && typeof data === "object") setDinocats([data]);
        else setDinocats([]);

      } catch (err) {
        console.error("Erro ao carregar dinocats:", err);
        setDinocats([]);
      }
    };

    loadDinocats();

  }, [user]);

  // ------------------------------
  // Eventos do Socket
  // ------------------------------
  useEffect(() => {
    if (!socket) return;

    // Oponente marcou ready
    const handleOpponentReady = ({ userId: readyUserId, dinocat }) => {
      if (readyUserId !== user.id) {
        setOpponentReady(true);
        console.log("Oponente está ready com:", dinocat);
      }
    };

    // Ambos estão ready
    const handleBothReady = () => {
      console.log("Ambos estão ready! Avançando para a batalha...");
      if (typeof onBothReady === "function") onBothReady();
    };

    socket.on("opponentReady", handleOpponentReady);
    socket.on("bothReady", handleBothReady);

    return () => {
      socket.off("opponentReady", handleOpponentReady);
      socket.off("bothReady", handleBothReady);
    };
  }, [socket, user.id, onBothReady]);

  // ------------------------------
  // Seleção de Dinocat
  // ------------------------------
  const handleChoose = (dino) => {
    if (typeof onChoose === "function") onChoose(dino);

    if (battleId) {
      socket.emit("dinocatSelected", { roomId: battleId, dinocat: dino });
      console.log("Dinocat selecionado enviado:", dino, "para room", battleId);
    } else {
      console.warn("Não posso enviar dinocatSelected — socket/roomId ausente");
    }
  };

  // ------------------------------
  // Ready do jogador
  // ------------------------------
  const handlePlayerReady = () => {
    if (!selectedDinocat) return alert("Escolha um Dinocat primeiro!");
    setReady(true);

    socket.emit("playerReady", { battleId, userId: user.id, dinocat: selectedDinocat });
    console.log("Enviei playerReady com:", selectedDinocat);
  };

  // ------------------------------
  // JSX
  // ------------------------------
  return (
    <div className="dinocat-selection-container">
      {dinocats.map(dino => (
        <DinocatCard
          key={dino.id}
          dino={dino}
          onChoose={handleChoose}
        />
      ))}

      <button
        onClick={handlePlayerReady}
        disabled={ready} // impede múltiplos clicks
      >
        Ready
      </button>

      {opponentReady && <p>Oponente está pronto!</p>}
    </div>
  );
}
