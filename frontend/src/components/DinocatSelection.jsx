import React, { useState, useEffect } from 'react';
import DinocatCard from './DinocatCard';
import DinocatSmallCard from './DinocatSmallCard';
import '../css/dinocats.css';
import '../css/dinocats-card.css';
import '../css/dinocats-smallcard.css';

// --- COMPONENTE PRINCIPAL: ESCOLHA DE DINOCATS ---
export default function DinocatSelection({ user, battleId, battleState, socket, navigate }) {
    const [myDinocats, setMyDinocats] = useState([]);

    // --- Carrega os dinocats do usuário logado ---
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

    // --- Escolhe um dinocat ---
    const handleChooseDinocat = (dinocat) => {
        if (socket && battleId && user) {
            socket.emit('selectDinocat', { battleId, userId: user.id, dinocat });
        }
    };

    // --- Marca o jogador como pronto ---
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
        return navigate('/home')
    }

    // --- Dados do jogador e oponente ---
    const myPlayerState = battleState?.players?.[user.id] || {};
    const opponentId = battleState.playerOrder.find(id => id !== user.id);
    const opponentState = opponentId ? battleState.players[opponentId] : null;

    return (
        <div className="select-dinocat">

            {/* --- Header principal --- */}
            <div className="header">
                <div className="headertext">
                    <b className="select-your-dinocat">Select your dinocat</b>
                    <b className="and-be-ready">and be ready!</b>
                </div>
            </div>

            {/* --- Corpo principal --- */}
            <div className="body">
                <div className="selectedsection">

                    {/* --- Painel do jogador --- */}
                    <div className="yours">
                        <div className="headertext">
                            <div className="you">
                                <b className="select-your-dinocat">You</b>
                                <b className="name">@{user.name}</b>
                            </div>
                            <b className="and-be-ready">
                                {myPlayerState?.isReady ? "< ready >" : "< waiting to be ready >"}
                            </b>
                        </div>

                        <div className="dinocatchoosen">
                            <div className="dinocatcard">
                                {myPlayerState?.dinocat ? (
                                    <DinocatCard dino={myPlayerState.dinocat} yours={true} />
                                ) : (
                                    <p>Selecione um dinocat abaixo</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- Botão de pronto --- */}
                    <div
                        className="ready-button"
                        id="readyButtonContainer"
                        onClick={handlePlayerReady}
                    >
                        <b className="select-your-dinocat">Are you ready ?</b>
                        <b className="click-me">click me</b>
                    </div>

                    {/* --- Painel do oponente --- */}
                    <div className="yours">
                        <div className="headertext">
                            <div className="you">
                                <b className="select-your-dinocat">Opponent</b>
                                <b className="name">@{opponentId || "???"}</b>
                            </div>
                            <b className="and-be-ready">
                                {opponentState?.isReady ? "< ready >" : "< waiting to be ready >"}
                            </b>
                        </div>

                        <div className="dinocatchoosen">
                            <div className="select-dinocat-dinocatcard">
                                {opponentState?.dinocat ? (
                                    <DinocatCard dino={opponentState.dinocat} yours={false} />
                                ) : (
                                    <p>Oponente está escolhendo...</p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- Lista de dinocats pequenos do jogador --- */}
                <div className="your-dinocats">
                    <b className="select-your-dinocat">Your dinocats</b>
                    <div className="dinocatchoosen2">
                        {myDinocats.map((dino) => (
                            <DinocatSmallCard
                                key={dino.id}
                                dino={dino}
                                selected={myPlayerState?.dinocat?.id === dino.id}
                                onChoose={() => handleChooseDinocat(dino)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
