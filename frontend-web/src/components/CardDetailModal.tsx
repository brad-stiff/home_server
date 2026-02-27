import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './CardDetailModal.css';

type CardDetailModalProps = {
  card: any; // TODO: update type
  onClose: () => void;
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const [faceIndex, setFaceIndex] = useState(0);

  const face = card.card_faces?.[faceIndex] ?? card;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{face.name}</h2>

        {face.image_uris?.normal && (
          <img
            className="modal-card-img"
            src={face.image_uris.normal}
            alt={face.name}
          />
        )}

        <div className="modal-details">
          <p><strong>Type:</strong> {face.type_line}</p>
          {face.mana_cost && (
            <p><strong>Mana Cost:</strong> {face.mana_cost}</p>
          )}
          {face.oracle_text && (
            <p className="oracle-text">{face.oracle_text}</p>
          )}
        </div>

        {card.card_faces?.length === 2 && (
          <div className="face-toggle">
            <button
              onClick={() => setFaceIndex(0)}
              className={faceIndex === 0 ? "active" : ""}
            >
              Front
            </button>
            <button
              onClick={() => setFaceIndex(1)}
              className={faceIndex === 1 ? "active" : ""}
            >
              Back
            </button>
          </div>
        )}

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
