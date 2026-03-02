import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './CardDetailModal.css';
import type { MTGCard } from '../../../core/types/card';

type CardDetailModalProps = {
  card: MTGCard;
  onClose: () => void;
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  const [face_index, setFaceIndex] = useState(0);

  const has_card_faces = !!card.card_faces;
  const is_shared_card_face = card.layout === 'split';

  const card_image_uris = !is_shared_card_face && !!card.card_faces ? card.card_faces[face_index].image_uris! : card.image_uris;
  const card_face = card.card_faces?.[face_index] ?? card;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{card.name}</h2>

        {card_image_uris.normal && (
          <img
            src={card_image_uris.normal}
            alt={card_face.name}
            className="modal-card-img"
          />
        )}

        <div className="modal-details">
          {has_card_faces && (
            <p><strong>Name:</strong> {card_face.name}</p>
          )}
          <p><strong>Type:</strong> {card_face.type_line}</p>
          {card_face.mana_cost && (
            <p><strong>Mana Cost:</strong> {card_face.mana_cost}</p>
          )}
          {card_face.oracle_text && (
            <p className="oracle-text">{card_face.oracle_text}</p>
          )}
        </div>

        {card.card_faces?.length === 2 && (
          <div className="face-toggle">
            <button
              onClick={() => setFaceIndex(0)}
              className={face_index === 0 ? "active" : ""}
            >
              {is_shared_card_face ? "Left" : "Front"}
            </button>
            <button
              onClick={() => setFaceIndex(1)}
              className={face_index === 1 ? "active" : ""}
            >
              {is_shared_card_face ? "Right" : "Back"}
            </button>
          </div>
        )}

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
