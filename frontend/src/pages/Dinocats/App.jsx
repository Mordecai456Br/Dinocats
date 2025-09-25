import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// Componentes
import Login from '/src/components/Login';
import Register from '/src/components/Register';
import Home from '/src/components/Home';
import DinocatSelection from '/src/components/DinocatSelection';
import Battle from '/src/components/Battle';
import Landingpage from '../../components/LandingPage';


export default function App() {
    const [user, setUser] = useState(null);
    const [battleId, setBattleId] = useState(null);
    const [battleState, setBattleState] = useState(null);


    const navigate = useNavigate();
    const socketRef = useRef(null);

    // Conecta o socket uma vez
    useEffect(() => {
        // Usa a URL atual do site em produção ou localhost em dev
        const socketUrl =
            import.meta.env.MODE === 'development'
                ? 'http://localhost:5000'
                : window.location.origin;

        socketRef.current = io(socketUrl, { autoConnect: true });
        const socket = socketRef.current;

        socket.on('connect', () => console.log('Socket conectado:', socket.id));

        return () => {
            socket.disconnect();
        };
    }, []);
    // Efeito para gerenciar usuário online e eventos do socket
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !user) return;

        // Marca jogador online
        socket.emit('playerOnline', { userId: user.id });

        // Reconexão
        const handleConnect = () => {
            socket.emit('playerOnline', { userId: user.id });
        };
        socket.on('connect', handleConnect);

        // Recebe atualizações de batalha
        const handleBattleStateUpdate = (newState) => {
            console.log('Estado da batalha atualizado:', newState);
            setBattleState(newState);
        };
        socket.on('battleStateUpdate', handleBattleStateUpdate);

        // Início da batalha
        const handleBattleStart = (finalState) => {
            console.log('Iniciando batalha!', finalState);
            setBattleState(finalState);
            navigate('/battle');
        };
        socket.on('battleStart', handleBattleStart);

        // Oponente desconectou
        const handleOpponentDisconnected = ({ userId }) => {
            alert(`Oponente ${userId} desconectou!`);
            setBattleState(null);
            setBattleId(null);
            navigate('/home');
        };
        socket.on('opponentDisconnected', handleOpponentDisconnected);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('battleStateUpdate', handleBattleStateUpdate);
            socket.off('battleStart', handleBattleStart);
            socket.off('opponentDisconnected', handleOpponentDisconnected);
        };
    }, [user, navigate]);

    // Recupera usuário da sessão ao montar
    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    // Funções para Login/Logout
    const handleLogin = useCallback((loggedUser) => {
        setUser(loggedUser);
        sessionStorage.setItem('user', JSON.stringify(loggedUser));
        navigate('/home');
    }, [navigate]);

    const handleLogout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem("user");
        navigate("/login");
    }, [navigate]);

    // Entrar na batalha
    const handleJoinBattle = (newBattleId) => {
        setBattleId(newBattleId);
        if (socketRef.current && user) {
            socketRef.current.emit('joinBattleRoom', { battleId: newBattleId, user });
            navigate('/dinocat-selection');
        }
    };

    return (
        <Routes>

            
            <Route path='/' element={<Landingpage navigate={navigate} />} />

            <Route path='/login' element={<Login onLogin={handleLogin} />} />

            <Route path='/register' element={<Register onRegister={(user) => console.log("Registrado:", user)} />
} />

            <Route path='/home' element={
                <Home
                    user={user}
                    socket={socketRef.current}
                    onJoinBattle={handleJoinBattle}
                    handleLogout={handleLogout}
                    setBattleId={setBattleId}
                    battleId={battleId}
                />
            } />

            <Route path='/dinocat-selection' element={
                <DinocatSelection
                    user={user}
                    battleId={battleId}
                    battleState={battleState}
                    socket={socketRef.current}

                />
            } />

            <Route path='/battle' element={
                <Battle
                    user={user}
                    battleState={battleState}
                    socket={socketRef.current}






                />
            } />
        </Routes>
    );
}