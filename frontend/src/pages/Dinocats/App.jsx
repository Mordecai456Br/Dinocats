import { useState } from 'react'

import './App.css'

import { useEffect } from "react";

function App() {
    const [message, setMessage] = useState("");
    const [dinocats, setDinocats] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/dinocats')
            .then(res => res.json())
            .then(data => setDinocats(data))
            .catch(err => console.error(err))
    }, []);

    return (
        <div>
            <h1>Minha Aplicação</h1>
            <p>{message}</p>

            <div className='dinocats-container'>
                {dinocats.map((dinocat) => (
                <div key={dinocat.id} className='dinocat-card'>
                    <h3>{dinocat.name}</h3>
                    <p>{dinocat.personality}</p>
                    <p>{dinocat.hp_base}</p>
                    <p>{dinocat.attack_base}</p>
                </div>
                ))}
            </div>
        </div>
    );
}

export default App;

