// DinocatSelection.jsx
import React, { useState, useEffect } from 'react';
import DinocatCard from './DinocatCard';
import '../css/dinocats.css';

// --- COMPONENTE DE UI, RECEBE ESTADO E ENVIA AÇÕES ---
export default function DinocatSelection({ user, battleId, battleState, socket }) {
    const [myDinocats, setMyDinocats] = useState([]);
   
    // Busca os dinocats do usuário logado
    useEffect(() => {
        if (!user) return;
        const loadDinocats = async () => {
            try {
                const res = await fetch(`http://localhost:5000/users/${user.id}/dinocats`);
                const data = await res.json();
                setMyDinocats(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Erro ao carregar dinocats:', err);
            }
        };
        loadDinocats();
    }, [user]);

    // Função para escolher um dinocat
    const handleChooseDinocat = (dinocat) => {
        if (socket && battleId && user) {
            socket.emit('selectDinocat', { battleId, userId: user.id, dinocat });
        }
    };
    
    // Função para sinalizar que o jogador está pronto
    const handlePlayerReady = () => {
        if (!myPlayerState?.dinocat) {
            alert('Você precisa selecionar um Dinocat antes de ficar pronto!');
            return;
        }
        if (socket && battleId && user) {
            socket.emit('playerReady', { battleId, userId: user.id });
        }
    };

    if (!battleState || !user) {
        return <div>Aguardando dados da sala...</div>;
    }
    
    // Extrai os dados do jogador e do oponente do estado central
    const myPlayerState = battleState?.players?.[user.id] || {};
    const opponentId = battleState.playerOrder.find(id => id !== user.id);
    const opponentState = opponentId ? battleState.players[opponentId] : null;

    return (
        <div className="dinocat-selection-container">
            <h2>Escolha seu Combatente!</h2>
            
            <div className="selection-panels">
                {/* Painel do Jogador */}
                <div className="player-panel">
                    <h3>{user.name} (Você)</h3>
                        {myPlayerState?.isReady 
                            ? <p className="status-ready">✅ Você está pronto!</p>
                            : <button onClick={handlePlayerReady} disabled={!myPlayerState?.dinocat}>Estou Pronto!</button>
                        }
                    <div className="dinocat-list">
                        {myDinocats.map((dino) => (
                            <DinocatCard 
                                key={dino.id} 
                                dino={dino}
                                isSelected={myPlayerState.dinocat?.id === dino.id}
                                onChoose={() => handleChooseDinocat(dino)} 
                            />
                        ))}
                    </div>
                </div>

                {/* Painel do Oponente */}
                <div className="opponent-panel">
                    {opponentState ? (
                        <>
                        <h3>Oponente</h3>
                        {opponentState.isReady 
                            ? <p className="status-ready">✅ Oponente está pronto!</p>
                            : <p className="status-waiting">Aguardando oponente...</p>
                        }
                            {opponentState.dinocat ? (
                                <DinocatCard dino={opponentState.dinocat} isSelected={true} />
                            ) : (
                                <p>Oponente está escolhendo...</p>
                            )}
                        </>
                    ) : (
                        <p>Aguardando oponente entrar na sala...</p>
                    )}
                    
                </div>
            </div>
        </div>
    );
}
