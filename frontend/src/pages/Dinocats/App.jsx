import { useState } from 'react';
import Login from '../../components/Login.jsx';
import Home from '../../components/Home';
import DinocatSelection from '../../components/DinocatSelection';
import Battle from '../../components/Battle';

export default function App() {
    const [user, setUser] = useState(null); // usuário logado
    const [currentScreen, setCurrentScreen] = useState('login'); // controla tela
    const [selectedDinocat, setSelectedDinocat] = useState(null); // dinocat escolhido
    const [battleData, setBattleData] = useState(null); // dados da batalha

    return (
        <div>
            {currentScreen === 'login' && (
                <Login 
                    onLogin={(loggedUser) => {
                        setUser(loggedUser);
                        setCurrentScreen('home');
                    }} 
                />
            )}

            {currentScreen === 'home' && user && (
                <Home 
                    user={user} 
                    onSelectDinocat={() => setCurrentScreen('dinocats')}
                />
            )}

            {currentScreen === 'dinocats' && user && (
                <DinocatSelection 
                    user={user}
                    onChoose={(dinocat) => {
                        setSelectedDinocat(dinocat);
                        setCurrentScreen('battle');
                    }}
                />
            )}

            {currentScreen === 'battle' && user && selectedDinocat && (
                <Battle 
                    user={user}
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
