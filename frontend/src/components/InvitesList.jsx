import { useEffect, useState } from "react";

export default function InvitesList({ userId, onAcceptInvite }) {
  const [invites, setInvites] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null)

  useEffect(() => {
    if (!open) return;
    fetch(`http://localhost:5000/users/${userId}/open_invites`)
      .then((res) => res.json())
      .then(setInvites)
      .catch(console.error);
  }, [open, userId]);

  const handleAcceptInvite = async (inviteId, accept, opencase) => {
    await fetch(`http://localhost:5000/invites/${inviteId}/accept`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accepted: accept, opencase: opencase }),
    });
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
  };

  const handleDeclineInvite = async (inviteId, accept, opencase) => {
    await fetch(`http://localhost:5000/invites/${inviteId}/decline`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accepted: accept, opencase: opencase }),
    });
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
  };

  return (

    <div style={{ position: "absolute", top: 10, left: 10 }}>
      <button onClick={() => setOpen(!open)}>Notifications</button>
      {open && (
        <div className="invite-list">
          <h3>Invites</h3>
          {invites.length === 0 ? (
            <p>None invatations</p>
          ) : (
            invites.map((invite) => (
              <div key={invite.id} className="invite-item">
                <p><b>User {invite.user1_id}</b> invited you for a battle</p>
                <button onClick={() => setConfirmModal({ inviteId: invite.id, action: "accept" })}>Accept</button>
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
    </div>
  );
}
