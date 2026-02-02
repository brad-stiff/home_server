import { z } from 'zod';
import type { UserLoginRequest } from "types/user";

// Zod schemas
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerSchema = z.object({
  email: z.string().refine((val) => emailRegex.test(val), {
    message: 'Invalid email format',
  }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().refine((val) => emailRegex.test(val), {
    message: 'Invalid email format',
  }),
  password: z.string().min(1, 'Password is required'),
});

const profilePictureSchema = z.object({
  image_base64: z.string().min(1, 'image_base64 is required'),
});

const firstNameSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name must be 100 characters or less'),
});

const lastNameSchema = z.object({
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name must be 100 characters or less'),
});

const passwordUpdateSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

// Helper function to convert Zod errors to our format
function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((err) => {
    const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
    return `${path}${err.message}`;
  });
}

export function validateRegister(body: unknown): { data: UserLoginRequest } | { errors: string[] } {
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }

  return { data: result.data };
}

export function validateLogin(body: unknown): { data: UserLoginRequest } | { errors: string[] } {
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }

  return { data: result.data };
}

export function validateProfilePicture(body: unknown): { data: { image_base64: string } } | { errors: string[] } {
  // First validate the basic structure
  const result = profilePictureSchema.safeParse(body);

  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }

  const { image_base64 } = result.data;

  // Strip data URL prefix if present
  const cleaned_base64 = image_base64.replace(/^data:image\/\w+;base64,/, '');

  // Basic base64 validation
  const base64_regex = /^[A-Za-z0-9+/]+={0,2}$/;

  if (!base64_regex.test(cleaned_base64)) {
    return { errors: ['invalid base64 image format'] };
  }

  // Optional: size limit (~500 KB)
  if (cleaned_base64.length > 700_000) {
    return { errors: ['image is too large (max ~500KB)'] };
  }

  return { data: { image_base64 } };
}

export function validateFirstName(body: unknown): { data: { first_name: string } } | { errors: string[] } {
  const result = firstNameSchema.safeParse(body);

  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }

  return { data: result.data };
}

export function validateLastName(body: unknown): { data: { last_name: string } } | { errors: string[] } {
  const result = lastNameSchema.safeParse(body);

  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }

  return { data: result.data };
}

export function validatePasswordUpdate(body: unknown): { data: { current_password: string; new_password: string } } | { errors: string[] } {
  const result = passwordUpdateSchema.safeParse(body);

  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }

  return { data: result.data };
}

