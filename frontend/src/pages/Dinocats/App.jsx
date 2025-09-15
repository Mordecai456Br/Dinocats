import { useState, useRef, useEffect } from 'react';
import Login from '../../components/login';
import Home from '../../components/Home';
import DinocatSelection from '../../components/DinocatSelection';
import Battle from '../../components/Battle';

import { io } from "socket.io-client";

export default function App() {
    const [user, setUser] = useState(null); // usuário logado
    const [currentScreen, setCurrentScreen] = useState('login'); // controla tela
    const [selectedDinocat, setSelectedDinocat] = useState(null); // dinocat escolhido
    const [battleData, setBattleData] = useState(null); // dados da batalha

    const socketRef = useRef(null);

    useEffect(() => {
        // cria socket
        socketRef.current = io('http://localhost:5000');

        // evento quando conecta
        socketRef.current.on('connect', () => {
            console.log('Conectado com id', socketRef.current.id);

            // envia ping de teste
            socketRef.current.emit('ping');
        });

        // escuta resposta do servidor
        socketRef.current.on('pong', (data) => {
            console.log('Servidor respondeu:', data);
        });
       
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (
        <div>
            {currentScreen === 'login' && (
                <Login
                    onLogin={(loggedUser) => {
                        setUser(loggedUser);
                        setCurrentScreen('home');

                        // registra o usuário no servidor
                        if (socketRef.current && socketRef.current.connected) {
                            socketRef.current.emit('loggedUser', loggedUser.id);
                            console.log(`Usuário ${loggedUser.name} logado no servidor`);
                        } else {
                            // caso ainda não tenha conectado
                            socketRef.current.on('connect', () => {
                                socketRef.current.emit('loggedUser', loggedUser.id);
                                console.log(`Usuário ${loggedUser.name} se conectou`);
                            });
                        }
                    }}
                />
            )}

            {currentScreen === 'home' && user && (
                <Home
                    user={user}
                    socket={socketRef.current}
                    onBothInRoom={() => {
                        setCurrentScreen('dinocats')
                        /*
                        if (socketRef.current) {
                            socketRef.current.emit('registerUser', loggedUser.id);
                            console.log(`Usuário ${loggedUser.name} registrado no servidor`);
                        }
                            */
                    }}


                />
            )}

            {currentScreen === 'dinocats' && user && (
                <DinocatSelection
                    user={user}
                    socket={socketRef.current}
                    onChoose={(dinocat) => {
                        setSelectedDinocat(dinocat);
                        setCurrentScreen('battle');
                    }}
                />
            )}

            {currentScreen === 'battle' && user && selectedDinocat && (
                <Battle
                    user={user}
                    socket={socketRef.current}
                    dinocat={selectedDinocat}
                    onEndBattle={() => {
                        setSelectedDinocat(null);
                        setBattleData(null);
                        setCurrentScreen('home');
                    }}
                />
            )}
        </div>
    );
}
