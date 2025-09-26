export default function DinocatCard({ dino, onChoose, yours }) {
    if (!dino || !dino.name) {
        return null; // ou um fallback visual
    }

    return (

        <div class="dinocat-card">
            <div class="dinocat-header">
                <div class="header-text">
                    <p class="dinocat-name">{dino.name}</p>
                    <p class="personality-text">ENTJ</p>
                </div>
                <div class="header-status">
                    <b class="health-status">
                        <span>HP: 200</span>
                    </b>
                    <div class="healthbar">
                        <div class="healthbar-base">
                        </div>
                        <div class="healthbar-item">
                        </div>
                    </div>
                </div>
            </div>
            <div class="emotions-container">
                <div class="emotion">
                    <p class="emotion-text">Determinado</p>
                </div>
            </div>
            <img class="dinocat-image" src={dino.image_url} alt=""/>
        </div>

    );
}