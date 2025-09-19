import React, { useEffect, useState } from "react";
import BattleLayout from "./BattleLayout";

export default function Battle({ selectedDinocatId, opponentDinocatId }) {
  const [selectedDinocat, setSelectedDinocat] = useState(null);
  const [opponentDinocat, setOpponentDinocat] = useState(null);
  const API_URL = "http://localhost:5000";
  
  useEffect(() => {
    async function fetchDinocats() {
      try {
        // Buscar dados do player
        const playerRes = await fetch(`${API_URL}/dinocats/${selectedDinocatId}`);
        const playerData = await playerRes.json();

        // Buscar skills do player
        const playerSkillsRes = await fetch(`${API_URL}/${selectedDinocatId}/skills`);
        const playerSkills = await playerSkillsRes.json();

        setSelectedDinocat({ ...playerData, skills: playerSkills });

        // Buscar dados do oponente
        const opponentRes = await fetch(`${API_URL}/dinocats/${opponentDinocatId}`);
        const opponentData = await opponentRes.json();

        // Buscar skills do oponente
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
