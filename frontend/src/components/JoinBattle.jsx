import { useEffect, useState } from "react";

export default function JoinBattle({ user, socket }) {
  const [inviteId, setInviteId] = useState("");
  const [inBattle, setInBattle] = useState(false); // controla se entrou na batalha
  const [feedback, setFeedback] = useState("");

  if (!user) return <p>Carregando...</p>;

  const showFeedback = (message) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), 3000);
  };

  useEffect(() => {
    if (!socket) return;

    // evento disparado quando todos estão na sala
    socket.on("bothInRoom", ({ inviteId: roomId }) => {
      if (roomId === inviteId) {
        setInBattle(true);
        showFeedback("Todos na sala! Você pode iniciar a batalha.");
      }
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

    return () => {
      socket.off("bothInRoom");
      socket.off("battleEnded");
    };
  }, [socket, inviteId, user.id]);

  const userHasPedingBattle = (userId) => {
    fetch(`http://localhost:5000/users/${userId}/pending_battle`)
      .then((res) => res.json())
      .then((data) => {
        // handle the response data here, for example:
        if (data.id) {
          showFeedback("Você tem uma batalha pendente!")
        } else {
          showFeedback("Nenhuma batalha pendente encontrada.");
        }
      })
      .catch(console.error);
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
      <div>

        {/*<input
          id="joinBattleInviteId"
          type="text"
          placeholder="inviteId"
          value={inviteId}
          onChange={(e) => setInviteId(e.target.value)}
          disabled={inBattle} // não permite mudar inviteId dentro da batalha
        />*/}

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
