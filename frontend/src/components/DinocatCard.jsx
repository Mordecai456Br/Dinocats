export default function DinocatCard({ dino, onChoose, yours }) {
    if (!dino|| !dino.name) {
        return null; // ou um fallback visual
    }

    return (
        <div className="dinocat-card">
            <div className="dinocat-img-text">
                <img
                    className="dinocat-img"
                    src={dino.image_url}
                    alt={dino.name}
                />
                <div className="dinocat-text-div">
                    <p className="dinocat-name">{dino.name}</p>
                    <p className="dinocat-hp">{dino.level}</p>
                    <p className="dinocat-personality">{dino.personality}</p>
                </div>
            </div>

            {yours && <button
                className="dinocat-choose"
                onClick={() => onChoose(dino)}
            >
                Choose
            </button>}
        </div>
    );
}
