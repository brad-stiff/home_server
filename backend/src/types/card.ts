export type Card = {
  id: number
  scryfall_id: string
  scryfall_data: MTGCard
  name: string //scryfall does the // thing with the name if 2 sided
  non_foil_count: number
  foil_count: number
}

export type CardRequest = {
  ids?: number[]
  scryfall_ids?: string[]
  name_search?: string
}

export type UpdateCardCountRequest = {
  scryfall_id: string
  count: number
  is_foil: boolean
}

export type CommanderDeck = {
  id: number
  user_id: number
  name: string
  deck_image_uri: string | null
  commanders: MTGCard[] //max 2
  other: MTGCard[] //99 or 98
  status: 'active' | 'inactive' | 'archived'
}

//Scryfall
export type CardSetResponse = {
  set_card_count: number
  cards: MTGCard[]
}

export type MTGSet = {
  object: string
  id: string,
  code: string
  mtgo_code: string
  arena_code: string
  name: string
  uri: string
  scryfall_uri: string
  search_uri: string
  released_at: string //YYYY-MM-DD
  set_type: string
  card_count: number
  parent_set_code: string
  digital: boolean
  nonfoil_only: boolean
  foil_only: boolean
  icon_svg_uri: string
}

export type SetResponse = {
  object: string
  has_more: boolean
  next_page?: string
  data: MTGSet[]
}

export type MTGCardLegality = 'legal' | 'not_legal'

export type MTGCardColors =
  'W' | // White - Plains
  'U' | // Blue - Island
  'B' | // Black - Swamp
  'R' | // Red - Mountain
  'G' | // Green - Forest
  'C'   // Colorless - Wastes

export type MTGCard = {
  object: string
  id: string
  oracle_id: string
  multiverse_ids: number[]
  mtgo_id: number
  arena_id: number
  tcgplayer_id: number
  cardmarket_id: number
  name: string
  lang: string
  released_at: string //YYYY-MM-DD
  uri: string
  scryfall_uri: string
  layout: string
  highres_image: boolean
  image_status: string
  image_uris: MTGCardImageUris
  mana_cost: string
  cmc: string
  type_line: string
  oracle_text: string
  power: string
  toughness: string
  colors: MTGCardColors[] //possibly null according to docs?
  color_identity: MTGCardColors[] //possibly null according to docs?
  keywords: string[]
  legalities : {
    standard: MTGCardLegality
    future: MTGCardLegality
    historic: MTGCardLegality
    timeless: MTGCardLegality
    gladiator: MTGCardLegality
    pioneer: MTGCardLegality
    modern: MTGCardLegality
    legacy: MTGCardLegality
    pauper: MTGCardLegality
    vintage: MTGCardLegality
    penny: MTGCardLegality
    commander: MTGCardLegality
    oathbreaker: MTGCardLegality
    standardbrawl: MTGCardLegality
    brawl: MTGCardLegality
    alchemy: MTGCardLegality
    paupercommander: MTGCardLegality
    duel: MTGCardLegality
    oldschool: MTGCardLegality
    premodern: MTGCardLegality
    predh: MTGCardLegality
  }
  games: string[]
  reserved: boolean
  game_changer: boolean
  foil: boolean
  nonfoil: boolean
  finishes: string[]
  oversized: boolean
  promo: boolean
  reprint: boolean
  variation: boolean
  set_id: string
  set: string
  set_name: string
  set_type: string
  set_uri: string
  set_search_uri: string
  scryfall_set_uri: string
  rulings_uri: string
  prints_search_uri: string
  collector_number: string //sort by this in binder
  digital: boolean
  rarity: string
  flavor_text: string
  card_back_id: string
  artist: string
  artisit_ids: string[]
  illustration_id: string
  border_color: string
  frame: string
  full_art: boolean
  textless: boolean
  booster: boolean
  story_spotlight: boolean
  promo_types: string[]
  edhrec_rank: number
  preview: {
    source: string
    source_uri: string
    previewed_at: string //YYYY-MM-DD
  }
  prices: {
    usd: string
    usd_foil: string | null
    usd_etched: string | null
    eur: string
    eur_foil: string | null
    tix: string
  }
  related_uris: {
    gatherer: string
    tcgplayer_infinite_articles: string
    tcgplayer_infntite_decks: string
    edhrec: string
  }
  purchase_uris: {
    tcgplayer: string
    cardmarket: string
    cardhoarder: string
  }
  card_faces?: []
}

export type MTGCardImageUris = {
  small: string
  normal: string
  large: string
  png: string
  art_crop: string
  border_crop: string
}

export type MTGCardFace = {
  artist: string
  artist_id: string
  colors: MTGCardColors[]
  illustration_id: string
  image_uris: MTGCardImageUris
  mana_cost: string
  name: string
  object: string
  oracle_text: string
  type_line: string
}

export type SetCardsResponse = {
  object: string
  total_cards: number
  has_more: boolean
  next_page?: string
  data: MTGCard[]
}
