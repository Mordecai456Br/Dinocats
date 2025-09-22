import React from "react";
import "../css/BattleLayout.css";
import DinocatCard from './DinocatCard';

export default function BattleLayout({ selectedDinocat, opponentDino }) {
  return (
    <div className="desktop2">
      {/* Dinocat do player */}
      <div className="dinocatFight">
        <DinocatCard dino={selectedDinocat} showButton={false} />
      </div>

      {/* Dinocat oponente */}
      <div className="frameGroup">
        <DinocatCard dino={opponentDino} showButton={false} />
      </div>

      {/* Skills do player */}
      <div className="skills">
        {selectedDinocat.skills.map((skill, i) => (
          <div key={i} className="skill">
            <div className="div">{skill.name}</div>
            <div className="parent">
              <div className="div">{skill.damage}</div>
              <div className="type">
                <div className="div">{skill.type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Imagens / arena */}
      <img
        className="geminiGeneratedImageQj4e64qIcon2"
        src={opponentDino.image}
        alt="opponent"
      />
      <img
        className="geminiGeneratedImageQj4e64qIcon3"
        src={selectedDinocat.image}
        alt="player"
      />
    </div>
  );
}
