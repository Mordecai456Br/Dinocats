export default function DinocatCard({ dino, onChoose }) {
    if (!dino|| !dino.name) {
        return null; // ou um fallback visual
    }

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
                    <p className="dinocat-hp">{dino.hp_base}</p>
                    <p className="dinocat-personality">{dino.personality}</p>
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
