import { useState, useRef, useEffect } from 'react';
import Login from '../../components/login';
import Home from '../../components/Home';
import DinocatSelection from '../../components/DinocatSelection';
import Battle from '../../components/Battle';
import { Routes, Route, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function App() {
    const [user, setUser] = useState(null); // usuário logado
    const [selectedDinocat, setSelectedDinocat] = useState(null); // dinocat escolhido
    const [battleData, setBattleData] = useState(null); // dados da batalha
    const [battleId, setBattleId] = useState(null);
    const navigate = useNavigate();
    const socketRef = useRef(null);
    
    
    const handleLogout = () => {
        setUser(null);
        sessionStorage.removeItem("user"); 
        navigate("/");
    };
    
    useEffect(() => {

        socketRef.current = io('http://localhost:5000');


        socketRef.current.on('connect', () => {
            console.log('Conectado com id', socketRef.current.id);


            socketRef.current.emit('ping');
        });


        socketRef.current.on('pong', (data) => {
            console.log('Servidor respondeu:', data);
        });

        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }


        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (

        <Routes>
            <Route path='/' element={
                <Login
                    onLogin={(loggedUser) => {
                        setUser(loggedUser);
                        sessionStorage.setItem('user', JSON.stringify(loggedUser))
                        navigate('/home');

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
            }
            />

            <Route path='/home' element={
                <Home
                    user={user}
                    socket={socketRef.current}
                    onBothInRoom={() => {navigate('/dinocat-selection')}}
                    handleLogout={handleLogout} 
                    setBattleId={setBattleId}

                />
            } />

            <Route path='/dinocat-selection' element={
                <DinocatSelection
                    user={user}
                    socket={socketRef.current}
                    onChoose={(dinocat) => {
                        setSelectedDinocat(dinocat);
                        
                    }}
                    onBothReady={() => {
                        navigate('/battle')
                    }}
                    selectedDinocat={selectedDinocat}
                    battleId={battleId}
                />
            } />

            <Route path='/battle' element={
                <Battle
                    user={user}
                    socket={socketRef.current}
                    dinocat={selectedDinocat}
                    onEndBattle={() => {
                        setSelectedDinocat(null);
                        setBattleData(null);
                        navigate('/home');
                    }}
                />
            } />
        </Routes>
    );
}
