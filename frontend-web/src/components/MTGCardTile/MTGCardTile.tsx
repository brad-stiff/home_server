import scoped_style from './MTGCardTile.module.css';
import type { MTGCard } from '../../../../core/types/card';

type MTGCardTileProps = {
  card: MTGCard
  onClick: (card: MTGCard) => void
  //is_owned: boolean
  //onToggleOwned: (id: string) => void
}

export function MTGCardTile({ card, onClick }: MTGCardTileProps) {
  const image = card.image_uris?.small ?? card.card_faces?.[0]?.image_uris?.small;

  return (
    <div className={scoped_style["card-slot"]} onClick={() => onClick(card)}>
      <img src={image} alt={card.name} />
    </div>
  );
}
