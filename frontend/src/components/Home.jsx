import InvitesList from "./InvitesList";
import JoinBattle from "./JoinBattle";
import '../css/home.css';
import Landingpage from './LandingPage';

export default function Home({ user, socket, onAcceptInvite, handleLogout, setBattleId, battleId, navigate }) {
  if (!user) return (
    <Landingpage navigate={navigate}></Landingpage>
  );

  return (
    <main className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-left">

          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Conteúdo principal dividido */}
      <section className="home-main">
        {/* Coluna esquerda: Invite List */}
        <div className="home-left">
          <InvitesList userId={user.id} socket={socket} onAcceptInvite={onAcceptInvite} />
        </div>

        {/* Coluna direita: Welcome + Join Battle */}
        <div className="home-right">
          <h1 className="welcome-text">Bem-vindo, {user.name}</h1>
          <JoinBattle user={user} socket={socket} setBattleId={setBattleId} battleId={battleId} />
        </div>
      </section>
    </main>
  );
}
