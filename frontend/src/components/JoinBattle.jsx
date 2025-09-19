import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinBattle({ user, socket }) {
  const [inviteId, setInviteId] = useState("");
  const [inBattle, setInBattle] = useState(false); // controla se entrou na batalha
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [battleId, setBattleId] = useState(null);
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

    // evento disparado quando todos estão na sala
    socket.on("bothInRoom", ({ inviteId }) => {
    
        setInBattle(true);

        let seconds = 5;
        setFeedback(`Todos na sala! Redirecionando para batalha em ${seconds}s`);
        const timer = setInterval(() => {
          seconds -= 1;
          if (seconds > 0) {
            setFeedback(`Todos na sala! Redirecionando para batalha em ${seconds}s`);
          } else {
            clearInterval(timer);
            setFeedback(""); 
            navigate("/dinocat-selection"); // redireciona
          }
        }, 1000);
    });

    // evento disparado quando a batalha termina
    socket.on("battleEnded", ({ winnerId, abandonerId }) => {
      if (winnerId === user.id) {
        showFeedback("Você venceu! 🎉");
      } else if (abandonerId === user.id) {
        showFeedback("Você desistiu da batalha 😢");
      } else {
        showFeedback(`Usuário ${winnerId} venceu a batalha!`);
      }
      setInBattle(false);
      setInviteId(""); // limpa campo
    });

    socket.on('userJoined', (data) => {
      console.log(`user ${data.userId} entrou na sala ${data.battleId}`)
    })

    socket.on('message', ({ userId, message, socket }) => {
      console.log(`${socket} | user ${userId}: ${message}`)
    })
    return () => {
      socket.off("bothInRoom");
      socket.off("battleEnded");
      socket.off("joinBattleRoom");
      socket.off("userJoined");
      socket.off('message');
    };
  }, [socket, inviteId, user.id, navigate]);

  const userHasPedingBattle = (userId) => {
    fetch(`http://localhost:5000/users/${userId}/pending_battle`)
      .then((res) => res.json())
      .then((data) => {
        // handle the response data here, for example:
        if (data.id) {
          setBattleId(data.id);
          socket.emit('joinBattleRoom', { battleId: data.id, userId });
          showFeedback(`Você entrou na batalha ${data.id}`)
        } else {
          showFeedback("Nenhuma batalha pendente encontrada.");
        }
      })
      .catch(console.error);
  };

  const sendMessage = () => {
    if (!battleId) return showFeedback("Nenhuma batalha ativa!");
    if (!message.trim()) return showFeedback("Mensagem vazia!");

    socket.emit('sendMessage', { roomId: battleId, message: message, userId: user.id })
  };

  /*const joinBattle = () => {
    if (!inviteId) return showFeedback("Digite o inviteId!");
    socket.emit("joinBattleRoom", { inviteId, userId: user.id });
  };
*/

  const abandonBattle = () => {
    if (!inviteId) return showFeedback("Digite o inviteId!");
    socket.emit("leaveBattleRoom", { inviteId, userId: user.id });
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


        <button onClick={() => userHasPedingBattle(user.id)} disabled={inBattle}>
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
