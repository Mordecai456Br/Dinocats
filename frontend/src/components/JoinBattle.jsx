import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinBattle({ user, socket, battleId, setBattleId }) {
  const [inviteId, setInviteId] = useState("");
  const [inBattle, setInBattle] = useState(false); // controla se entrou na batalha
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  if (!user) return <p>Carregando...</p>;

  const showFeedback = (message, time, consoleLog) => {
    if (!time) time = 3000
    if (consoleLog === true) {
      setFeedback(message);
      console.log(message)
    } else {
      setFeedback(message);

    }
    setTimeout(() => setFeedback(""), time);
  };

  useEffect(() => {
    if (!socket) return;
    let timer;

    const handleBothInRoom = () => {
      setInBattle(true);

      let seconds = 3;
      setFeedback(`Todos na sala! Redirecionando para batalha em ${seconds}s`);
      timer = setInterval(() => {
        seconds -= 1;
        if (seconds > 0) {
          setFeedback(`Todos na sala! Redirecionando para batalha em ${seconds}s`);
        } else {
          clearInterval(timer);
          setFeedback("Redirecionando...");
          navigate("/dinocat-selection"); // redireciona
        }
      }, 1000);
    };

    const handleBattleEnded = ({ winnerId, abandonerId }) => {
      if (winnerId === user.id) {
        showFeedback("Você venceu! 🎉");
      } else if (abandonerId === user.id) {
        showFeedback("Você desistiu da batalha 😢");
      } else {
        showFeedback(`Usuário ${winnerId} venceu a batalha!`);
      }
      setInBattle(false);
      setBattleId(null); // limpa a batalha
    };

    const handleUserJoined = (data) => {
      console.log(`user ${data.userId} entrou na sala ${data.battleId}`);
    };

    const handleMessage = ({ userId: msgUserId, message: msg, socket: socketId }) => {
      console.log(`${socketId} | user ${msgUserId}: ${msg}`);
    };

    socket.on("bothInRoom", handleBothInRoom);
    socket.on("battleEnded", handleBattleEnded);
    socket.on("userJoined", handleUserJoined);
    socket.on("message", handleMessage);

    return () => {
      socket.off("bothInRoom", handleBothInRoom);
      socket.off("battleEnded", handleBattleEnded);
      socket.off("userJoined", handleUserJoined);
      socket.off("message", handleMessage);
      if (timer) clearInterval(timer);
    };
  }, [socket, user.id, navigate, setBattleId]);

  // Função para entrar em uma batalha pendente
  const userHasPendingBattle = (userId) => {
    fetch(`http://localhost:5000/users/${userId}/pending_battle`)
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setBattleId(data.id);
          if (socket && socket.connected) {
            socket.emit('joinBattleRoom', { battleId: data.id, user });
          } else {
            showFeedback("Socket não está conectado. Tente novamente.");
          }

          showFeedback(`Você entrou na batalha ${data.id}`);
        } else {
          showFeedback("Nenhuma batalha pendente encontrada.");
        }
      })
      .catch(console.error);
  };

  // Função para enviar mensagem
  const sendMessage = () => {
    if (!battleId) return showFeedback("Nenhuma batalha ativa!");
    if (!message.trim()) return showFeedback("Mensagem vazia!");
    socket.emit('sendMessage', { roomId: battleId, message, userId: user.id });
    setMessage(""); // limpa input
  };

  // Função para abandonar batalha
  const abandonBattle = () => {
    if (!battleId) return showFeedback("Nenhuma batalha ativa!");
    socket.emit("leaveBattleRoom", { battleId, userId: user.id });
    setBattleId(null);
    setInBattle(false);
    showFeedback("Você abandonou a batalha 😢");
  };

  return (
    <div>
      <h2>Entre numa batalha</h2>
      {battleId && <p>batalha atual: {battleId}</p>}
      <div>

        {/*<input
          id="joinBattleInviteId"
          type="text"
          placeholder="inviteId"
          value={inviteId}
          onChange={(e) => setInviteId(e.target.value)}
          disabled={inBattle} // não permite mudar inviteId dentro da batalha
        />*/}

        <input
          id="sendMessageInput"
          type="text"
          placeholder="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} disabled={!battleId}>
          SendMessage
        </button>


        <button onClick={() => userHasPendingBattle(user.id)} disabled={inBattle}>
          Join Battle
        </button>

        <button onClick={abandonBattle} disabled={!inBattle}>
          Abandon
        </button>
        {feedback && <p>{feedback}</p>}
      </div>
    </div>
  );
}
