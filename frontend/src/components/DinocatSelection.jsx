// DinocatSelection.jsx
import React, { useState, useEffect } from 'react';
import DinocatCard from './DinocatCard';
import '../css/dinocats.css';

export default function DinocatSelection({ user, socket, battleId, onChoose, selectedDinocat, onBothReady }) {
  const [dinocats, setDinocats] = useState([]);
  const [ready, setReady] = useState(false);       // se o player clicou ready
  const [opponentReady, setOpponentReady] = useState(false); // se o outro player já está ready


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

    if (!socket) return;
    const fn = ({ dinocat }) => console.log("opponentSelected recebido:", dinocat);
    socket.on("opponentSelected", fn);
    return () => {
      socket.off("opponentSelected", fn);
    };

  }, [user, socket]);


  useEffect(() => {
    if (!socket) return;

    const handleOpponentReady = ({ userId: readyUserId, dinocat }) => {
      if (readyUserId !== user.id) { // se não sou eu
        setOpponentReady(true);
        console.log("Oponente está ready com:", dinocat);
      }
    };

    const handleBothReady = () => {
      console.log("Ambos estão ready, pode ir para a batalha");
      onBothReady(); // aqui podemos navegar para /battle
    };

    socket.on("opponentReady", handleOpponentReady);
    socket.on("bothReady", handleBothReady);

    return () => {
      socket.off("opponentReady", handleOpponentReady);
      socket.off("bothReady", handleBothReady);
    };
  }, [socket, user.id, selectedDinocat]);

  const handleChoose = (dino) => {
    if (typeof onChoose === "function") onChoose(dino);
    console.log(battleId)
    console.log(socket)
    // envia a seleção para a sala via socket
    if (battleId) {
      // ✅ correto no cliente
      socket.emit("dinocatSelected", { roomId: battleId, dinocat: dino });

      console.log("enviei dinocatSelected", dino, "room", battleId);
    } else {
      console.warn("Não posso enviar dinocatSelected — socket/roomId ausente");
    }
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
      <button
        onClick={() => {
          if (!selectedDinocat) return alert("Escolha um Dinocat primeiro!");
          setReady(true);
          socket.emit("playerReady", { battleId, userId: user.id, dinocat: selectedDinocat });
        }}
        disabled={ready} // só pode clicar uma vez
      >
        Ready
      </button>

    </div>
  );
}
