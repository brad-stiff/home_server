import { selectQuery, modifyQuery } from "../util";
import type { Card, CardRequest } from "../../types/card";

export async function getCard(id: number) {
  const result = await getCards({ ids: [id] });
  return result[0] ?? null;
}

export async function getCards(request: CardRequest) {
  const wheres: string[] = [];
  const params: any[] = [];

  if (request.ids && request.ids.length > 0) {
    wheres.push('c.id IN (?)');
    params.push(request.ids);
  }

  if (request.scryfall_ids && request.scryfall_ids.length > 0) {
    wheres.push('c.scryfall_id IN (?)');
    params.push(request.scryfall_ids);
  }

  if (request.name_search && request.name_search.trim().length > 0) {
    wheres.push('c.name LIKE ?');
    params.push(`%${request.name_search.trim()}%`);
  }

  let where_clause = '';
  if (wheres.length > 0) {
    where_clause = 'WHERE ' + wheres.join(' AND ');
  }

  const results = await selectQuery<Card & { scryfall_data: any }>(`
    SELECT
      c.id,
      c.scryfall_id,
      c.scryfall_data,
      c.name,
      c.non_foil_count,
      c.foil_count
    FROM
      card c
    ${where_clause}
    ORDER BY
      c.name ASC
  `, params);

  // Ensure scryfall_data is parsed from JSON if returned as a string
  return results.map((card) => ({
    ...card,
    scryfall_data: typeof card.scryfall_data === 'string'
      ? JSON.parse(card.scryfall_data)
      : card.scryfall_data
  }));
}

export async function upsertCard(card: Card) {
  return modifyQuery(`
      INSERT INTO card (
        scryfall_id,
        scryfall_data,
        name,
        non_foil_count,
        foil_count
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?
      ) ON DUPLICATE KEY UPDATE
         scryfall_data = VALUES(scryfall_data),
         name = VALUES(name),
         non_foil_count = VALUES(non_foil_count),
         foil_count = VALUES(foil_count)
    `, [
    card.scryfall_id,
    JSON.stringify(card.scryfall_data),
    card.name,
    card.non_foil_count,
    card.foil_count
  ]);
}
