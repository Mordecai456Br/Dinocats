import InvitesList from "./InvitesList";
import JoinBattle from "./JoinBattle";


export default function Home({ user, socket ,onAcceptInvite, handleLogout }) {
  if (!user) return <p>Carregando...</p>; // evita erro até o user estar disponível
  
  return (
    <div>
      
      <h1>Bem-vindo, {user.name}</h1>
      <button onClick={handleLogout}> logout </button>
      <InvitesList userId={user.id} socket={socket} onAcceptInvite={onAcceptInvite}/>
      <JoinBattle user={user} socket={socket}></JoinBattle>
    </div>
  );
}
