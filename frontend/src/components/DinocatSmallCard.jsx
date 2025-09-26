export default function DinocatSmallCard({ dino, onChoose, yours }) {
    if (!dino || !dino.name) {
        return null; // ou um fallback visual
    }

    return (
        <div class="dinocat-mini-card" onClick={onChoose}>
            <div class="mini-header">
                <div class="mini-header-text">
                    <p class="mini-dinocat-name">{dino.name}</p>
                </div>
                <div class="mini-header-status">
                    <b class="mini-health-status">HP: <span>250</span></b>
                    <p class="mini-personality-text">ISFJ</p>
                </div>
            </div>
            <img class="mini-dinocat-image" src="dinocat.png" alt="Dinocat" />
        </div>
    );
}