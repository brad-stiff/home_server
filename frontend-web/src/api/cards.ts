import { api } from "./http";

export function getSets() {
  return api<any>("/api/cards/sets")
}

export function getSetCards(set_code: string) {
  return api(`/api/cards/sets/${set_code}/cards`)
}
