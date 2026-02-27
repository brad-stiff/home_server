import { api } from "./http";
import type { CardSetResponse, SetResponse } from "../../../core/types/card";

export function getSets() {
  return api<SetResponse>("/api/cards/sets")
}

export function getSetCards(set_code: string) {
  return api<CardSetResponse>(`/api/cards/sets/${set_code}/cards`)
}
