import { api } from "./http";
import type { CardSetResponse, SetResponse } from "../../../core/types/card";

// TODO: update type
export function getSets() {
  return api<SetResponse>("/api/cards/sets")
}

// TODO: update type
export function getSetCards(set_code: string) {
  return api<CardSetResponse>(`/api/cards/sets/${set_code}/cards`)
}
