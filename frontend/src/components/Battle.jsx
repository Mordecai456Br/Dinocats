
import React from 'react';
import DinocatCard from './DinocatCard';
import '../css/battle.css';

export default function Battle({ selectedDino }) {
  return (
    <div className="battle-container">
      <img className='background-battle-image' src="/app/assets/dinocatsFight.png"></img>
      <div className='background-battle-blur'></div>
      <h2>Lógica de batalha ainda n implementada :p</h2>
      <DinocatCard
        dino={selectedDino}
        showButton={false} 
      />
    
    </div>
  );
}
