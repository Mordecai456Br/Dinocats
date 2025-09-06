// DinocatCard.jsx
import React from 'react';
import '../css/dinocats.css';


export default function DinocatCard({ dino, onChoose }) {
    return (
        <div className="dinocat-card">
            <div className="dinocat-img-text">
                <img
                    className="dinocat-img"
                    src={dino.img}
                    alt={dino.name}
                />
                <div className="dinocat-text-div">
                    <p className="dinocat-name">{dino.name}</p>
                    <p className="dinocat-description">{dino.description}</p>
                </div>
            </div>

            <button
                className="dinocat-choose"
                onClick={() => onChoose(dino)}
            >
                Choose
            </button>
        </div>
    );
}

