import React, { useEffect, useState } from "react";
import BattleLayout from "./BattleLayout";

export default function Battle({ selectedDinocatId, opponentDinocatId }) {
  const [selectedDinocat, setSelectedDinocat] = useState(null);
  const [opponentDinocat, setOpponentDinocat] = useState(null);
  const API_URL = "http://localhost:5000";
  setSelectedDinocat(1);
  setOpponentDinocat(2);
  useEffect(() => {
    async function fetchDinocats() {
      try {
        // Buscar dados do dinocat
        const dinocatRes = await fetch(`${API_URL}/dinocats/${selectedDinocatId}`);
        const dinocatData = await dinocatRes.json();

        // Buscar skills do dinocat
        const dinocatSkillsRes = await fetch(`${API_URL}/${selectedDinocatId}/skills`);
        const dinocatSkills = await dinocatSkillsRes.json();

        setSelectedDinocat({ ...playerData, skills: playerSkills });

        // Buscar dados do dinocat oponente
        const opponentRes = await fetch(`${API_URL}/dinocats/${opponentDinocatId}`);
        const opponentData = await opponentRes.json();

        // Buscar skills do dinocat oponente
        const opponentSkillsRes = await fetch(`${API_URL}/${opponentDinocatId}/skills`);
        const opponentSkills = await opponentSkillsRes.json();

        setOpponentDinocat({ ...opponentData, skills: opponentSkills });
      } catch (err) {
        console.error("Erro ao carregar dinocats:", err);
      }
    }

    fetchDinocats();
  }, [selectedDinocatId, opponentDinocatId]);

  if (!selectedDinocat || !opponentDinocat) return <div>Carregando...</div>;

  return (
    <div className="battle-container">
      <h2>Batalha!</h2>
      <BattleLayout selectedDinocat={selectedDinocat} opponentDino={opponentDinocat} />
    </div>
  );
}
