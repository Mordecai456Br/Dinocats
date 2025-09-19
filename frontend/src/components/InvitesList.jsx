import { useEffect, useState, useRef } from "react";
import { io } from 'socket.io-client';


export default function InvitesList({ userId, onAcceptInvite, socket }) {
  const [invites, setInvites] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [userToInviteId, setUserToInviteId] = useState("");
  const [feedback, setFeedback] = useState("");


  useEffect(() => {

    if (!open) return;
    fetch(`http://localhost:5000/users/${userId}/open_invites`)
      .then((res) => res.json())
      .then(setInvites)
      .catch(console.error);

  }, [open, userId]);

 /*useEffect(() => {
    socket.on("bothInRoom", ({ inviteId }) => {
      console.log("Todos na sala! Mudando tela...");
     
    });

    return () => {
      socket.off("bothInRoom");
    };
  }, []); 
*/

  const handleAcceptInvite = async (invite, accept, opencase) => {

    const userRes = await fetch(`http://localhost:5000/users/${userId}`);
    const userData = await userRes.json();

    if (userData.is_on_battle_mode) {
      return showFeedback("Você já está em modo de batalha!");
    }

    const battleRes = await fetch(`http://localhost:5000/users/${userId}/pending_battle`);
    const pendingBattle = await battleRes.json();

    if (pendingBattle && pendingBattle.id) {
      return showFeedback("Você já possui uma batalha pendente!");
    }

    await fetch(`http://localhost:5000/invites/${invite.id}/accept`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accepted: accept, opencase: opencase }),
    });

    setInvites((prev) => prev.filter((i) => i.id !== invite.id));

    await fetch(`http://localhost:5000/battles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user1_id: invite.user1_id,
        user2_id: invite.user2_id,
        invite_id: invite.id,
        status: "pending",
      }),
    });

    showFeedback("Batalha criada, clique em join!");
  };


  const handleDeclineInvite = async (inviteId, accept, opencase) => {
    await fetch(`http://localhost:5000/invites/${inviteId}/decline`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accepted: accept, opencase: opencase }),
    });
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
  };

  const showFeedback = (message) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), 3000);
  };

  return (

    <div style={{ position: "absolute", top: 10, left: 10 }}>
      <button onClick={() => setOpen(!open)}>Notifications</button>
      {open && (
        <div className="invite-list" style={{ background: "light-gray" }}>
          <h3>Invites</h3>
          {invites.length === 0 ? (
            <p>None invatations</p>
          ) : (
            invites.map((invite) => (
              <div key={invite.id} className="invite-item">
                <p><b>{invite.users.name}</b> invited you for a battle</p>
                <p> data: [user_id = {invite.user1_id}] [invite_id = {invite.id}]</p>
                <button onClick={() => setConfirmModal({ inviteId: invite, action: "accept" })}>Accept</button>
                <button onClick={() => setConfirmModal({ inviteId: invite.id, action: "decline" })}>Decline</button>
              </div>
            ))
          )}
        </div>

      )}

      {
        confirmModal && (
          <div className="modal-invites">
            <p>
              Tem certeza que deseja{" "}
              {confirmModal.action === "accept" ? "aceitar" : "recusar"} esse
              convite?
            </p>
            <button onClick={() => { setConfirmModal(null) }}>Cancelar</button>
            <button
              onClick={async () => {
                try {
                  if (confirmModal.action === "accept") {
                    await handleAcceptInvite(confirmModal.inviteId, true, false);
                    if (typeof onAcceptInvite === "function") onAcceptInvite();
                  } else {
                    await handleDeclineInvite(confirmModal.inviteId, false, false);
                  }

                } catch (err) {
                  console.error("Erro ao processar invite:", err);
                } finally {
                  setConfirmModal(null);
                }
              }}
            >
              Sim
            </button>
          </div>
        )
      }

      <div>
        <input id="userToInvite_id" type="text" placeholder="userToInvite_id"
          value={userToInviteId}
          onChange={(e) => setUserToInviteId(e.target.value)} />
        <button
          onClick={async () => {
            try {
              const resUser = await fetch(`http://localhost:5000/users/${userToInviteId}`);
              if (!resUser.ok) {
                showFeedback("❌ Usuário não encontrado");
                return;
              }

              if (userId === userToInviteId) {
                showFeedback("❌ Você não pode se convidar");
                return;
              }

              const resInvite = await fetch(`http://localhost:5000/invites`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user1_id: userId, user2_id: userToInviteId }),
              });

              if (resInvite.ok) {
                showFeedback("✅ Convite enviado!")
                setUserToInviteId("")
              } else {
                showFeedback("❌ Erro ao enviar envite")
              }
            } catch (err) {
              console.error(err);
              showFeedback("⚠️ Erro de conexão");
            }
          }}
        > send </button>
        {feedback && <p>{feedback}</p>}
      </div>



    </div >

  );
}
