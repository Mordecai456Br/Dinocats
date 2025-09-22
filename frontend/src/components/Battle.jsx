// Battle.jsx
import React from 'react';
import DinocatCard from './DinocatCard';

export default function Battle({ selectedDino }) {
  return (
    <div className="battle-container">
      <h2>Batalha!</h2>
      <DinocatCard
        dino={selectedDino}
        showButton={false} // Não exibe o botão aqui
      />
      {/* Aqui você adicionará os atributos, habilidades e lógica da batalha */}
    </div>
  );
}
