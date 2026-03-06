import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import scoped_style from "./CardsPage.module.css";

import type { MTGCard, MTGSet } from '../../../../core/types/card';

import { getSets, getSetCards } from '../../api/cards';

import { TooltipPortal } from '../../components/TooltipPortal/TooltipPortal';
import { CardDetailModal } from '../../components/CardDetailModal/CardDetailModal';
import { MTGCardTile } from '../../components/MTGCardTile/MTGCardTile';

export function CardsPage() {
  const [card_sets, setCardSets] = useState<MTGSet[]>([]);
  const [selected_card_set_code, setSelectedCardSetCode] = useState<string | null>(null);
  const [selected_card_set_cards, setSelectedCardSetCards] = useState<MTGCard[]>([]);

  const [hovered_set, setHoveredSet] = useState<MTGSet | null>(null);
  const [mouse_pos, setMousePos] = useState({ x: 0, y: 0 });

  const [page, setPage] = useState(1);

  const [selected_card_for_popup, setSelectedCardForPopup] = useState<MTGCard | null>(null);

  const showSetError = () => toast.error("Failed to load set");


  useEffect(() => {
    getSets().then((sets_data) => {
      const sorted_sets = [...sets_data.data].sort((a, b) => {
        if (!a.released_at) return 1;
        if (!b.released_at) return -1;
        return new Date(b.released_at).getTime() - new Date(a.released_at).getTime();
      });

      setCardSets(sorted_sets);
    })
  }, []);

  useEffect(() => {
    if (!selected_card_set_code) return;

    setPage(1);

    getSetCards(selected_card_set_code).then((set_card_data) => {
      setSelectedCardSetCards(set_card_data.cards);
    }).catch((error) =>{
      console.error(error);
      showSetError();
    })

  }, [selected_card_set_code])

  const getPageSlots = () => {
    if (page === 1) {
      return {
        left: [],
        right: selected_card_set_cards.slice(0, 9)
      };
    }

    const start = 9 + (page - 2) * 18;
    return {
      left: selected_card_set_cards.slice(start, start + 9),
      right: selected_card_set_cards.slice(start + 9, start + 18)
    }
  }

  const { left, right } = getPageSlots();

  const total_pages = Math.ceil((selected_card_set_cards.length - 9) / 18) + 1;

  return (
    <div className={scoped_style["cards-container"]}>
      <Toaster />
      <div className={scoped_style["set-scroll"]}>
        {card_sets.map(set => (
          <div
            key={set.code}
            className={scoped_style["set-wrapper"]}
            onMouseEnter={() => setHoveredSet(set)}
            onMouseLeave={() => setHoveredSet(null)}
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
          >
            <img
              src={set.icon_svg_uri}
              alt={set.name}
              className={
                selected_card_set_code === set.code
                  ? `${scoped_style["set-icon"]} ${scoped_style["selected"]}`
                  : scoped_style["set-icon"]
              }
              onClick={() => setSelectedCardSetCode(set.code)}
            />
          </div>
        ))}
      </div>

      {hovered_set && (
        <TooltipPortal>
          <div
            className={scoped_style["tooltip-floating"]}
            style={{
              top: mouse_pos.y + 10,
              left: mouse_pos.x + 10
            }}
          >
            {hovered_set.name}<br />
            Card Count: { hovered_set.card_count}<br />
            Released: { hovered_set.released_at}
          </div>
        </TooltipPortal>
      )}

      {selected_card_set_cards.length > 0 && (
        <>
          <div className={scoped_style["card-binder"]}>
            <div className={scoped_style["binder-left"]}>
              {page === 1 ? (
                <div className={scoped_style["graph-placeholder"]}>Graph Data Here</div>
              ) : (
                left.map(card => (
                  <MTGCardTile
                    key={card.id}
                    card={card}
                    onClick={setSelectedCardForPopup}
                  />
                ))
              )}
            </div>

            <div className={scoped_style["binder-right"]}>
              {right.map(card => (
                <MTGCardTile
                  key={card.id}
                  card={card}
                  onClick={setSelectedCardForPopup}
                />
              ))}
            </div>
          </div>

          <div className={scoped_style["card-pagination"]}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            <span>Page {page} / {total_pages}</span>

            <button disabled={page === total_pages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}

      {selected_card_for_popup && (
        <CardDetailModal
          card={selected_card_for_popup}
          onClose={() => setSelectedCardForPopup(null)}
        />
      )}

    </div>
  );
}
