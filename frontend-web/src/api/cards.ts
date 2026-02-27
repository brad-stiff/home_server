import { api } from "./http";

// TODO: update type
export function getSets() {
  return api<any>("/api/cards/sets")
}

// TODO: update type
export function getSetCards(set_code: string) {
  return api<any>(`/api/cards/sets/${set_code}/cards`)
}
