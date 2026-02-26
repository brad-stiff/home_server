import { useEffect, useState } from 'react';
import './CardsPage.css'

import { getSets, getSetCards } from '../api/cards';
import { TooltipPortal } from '../components/TooltipPortal';
import { CardDetailModal } from '../components/CardDetailModal';

export function CardsPage() {
  const [card_sets, setCardSets] = useState([]);
  const [selected_card_set_code, setSelectedCardSetCode] = useState(null); //string | null
  const [selected_card_set_cards, setSelectedCardSetCards] = useState([]);

  const [hovered_set, setHoveredSet] = useState(null);
  const [mouse_pos, setMousePos] = useState({ x: 0, y: 0 });

  const [page, setPage] = useState(1);

  const [selected_card_for_popup, setSelectedCardForPopup] = useState(null);


  useEffect(() => {
    console.log('cards tab mounted');
    getSets().then((sets_data) => {
      console.log(sets_data);
      const sorted_sets = [...sets_data.data].sort((a, b) => {
        if (!a.released_at) return 1;
        if (!b.released_at) return -1;
        return new Date(b.released_at) - new Date(a.released_at);
      });
      console.log('sorted', sorted_sets);
      setCardSets(sorted_sets);
    })
  }, []);

  useEffect(() => {
    if (!selected_card_set_code) return;

    setPage(1);

    getSetCards(selected_card_set_code).then((set_card_data) => {
      console.log(set_card_data);
      const sorted_cards = [...set_card_data.cards].sort((a, b) => {
        const num_a = parseInt(a.collector_number);
        const num_b = parseInt(b.collector_number);
        return num_a - num_b;
      });
      //sort cards by collector_number?
      setSelectedCardSetCards(sorted_cards);
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
    <div className="cards-container">
      <h1>Cards</h1>

      <div className='set-scroll'>
        {card_sets.map(set => (
          <div
            key={set.code}
            className='set-wrapper'
            onMouseEnter={() => setHoveredSet(set)}
            onMouseLeave={() => setHoveredSet(null)}
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
          >
            <img
              src={set.icon_svg_uri}
              alt={set.name}
              className={
                selected_card_set_code === set.code
                  ? "set-icon selected"
                  : "set-icon"
              }
              onClick={() => setSelectedCardSetCode(set.code)}
            />
          </div>
        ))}
      </div>

      {hovered_set && (
        <TooltipPortal>
          <div
            className='tooltip-floating'
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

      <div className='card-binder'>
        <div className='binder-left'>
          {page === 1 ? (
            <div className='graph-placeholder'>Graph Data Here</div>
          ) : (
            left.map(card => (
              <div
                key={card.id}
                className='card-slot'
                onClick={() => setSelectedCardForPopup(card)}
              >
                <img src={card.image_uris?.small} alt={card.name} />
              </div>
            ))
          )}
        </div>

        <div className='binder-right'>
          {right.map(card => (
            <div
              key={card.id}
              className="card-slot"
              onClick={() => setSelectedCardForPopup(card)}
            >
              <img src={card.image_uris?.small} alt={card.name} />
            </div>
          ))}
        </div>
      </div>

      <div className='card-pagination'>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>Page {page} / {total_pages}</span>

        <button disabled={page === total_pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {selected_card_for_popup && (
        <CardDetailModal
          card={selected_card_for_popup}
          onClose={() => setSelectedCardForPopup(null)}
        />
      )}

    </div>
  );
}
