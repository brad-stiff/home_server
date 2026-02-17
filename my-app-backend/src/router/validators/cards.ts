import { z } from 'zod';
import type { UpdateCardCountRequest } from '../../types/card';

const cardsBySetSchema = z.object({
  set_code: z.string().min(3)
});

const cardByIdSchema = z.object({
  scryfall_card_id: z.string().uuid()
});

const updateCardCountSchema = z.object({
  scryfall_id: z.string().uuid(),
  count: z.number(), // can be positive or negative
  is_foil: z.boolean()
});

export function validateCardsBySet(body: unknown): { data: { set_code: string } } | { errors: string[] } {
  const result = cardsBySetSchema.safeParse(body);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateCardById(body: unknown): { data: { scryfall_card_id: string } } | { errors: string[] } {
  const result = cardByIdSchema.safeParse(body);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

export function validateUpdateCardCount(body: unknown): { data: UpdateCardCountRequest } | { errors: string[] } {
  const result = updateCardCountSchema.safeParse(body);
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  return { data: result.data };
}

function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((err) => {
    const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
    return `${path}${err.message}`;
  });
}
