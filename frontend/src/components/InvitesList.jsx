import { useEffect, useState } from "react";

export default function InvitesList({ userId }) {
  const [invites, setInvites] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch(`http://localhost:5000/users/${userId}/open_invites`)
      .then((res) => res.json())
      .then(setInvites)
      .catch(console.error);
  }, [open, userId]);

  const handleInvite = async (inviteId, accept, opencase) => {
    await fetch(`http://localhost:5000/invites/${inviteId}/accept`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accepted: accept , opencase: opencase}),
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
                <button onClick={() => handleInvite(invite.id, true, false)}>Accept</button>
                <button onClick={() => handleInvite(invite.id, false, false)}>Decline</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
