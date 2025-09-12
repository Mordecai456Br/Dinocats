import InvitesList from "./InvitesList";

export default function Home({ user, onAcceptInvite }) {
  if (!user) return <p>Carregando...</p>; // evita erro até o user estar disponível

  return (
    <div>
      <h1>Bem-vindo, {user.name}</h1>
      <InvitesList userId={user.id} onAcceptInvite={onAcceptInvite} user={user}/>
      
    </div>
  );
}
