import { z } from 'zod';

export const SignatureBlockSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  date: z.string().optional().or(z.literal('')),
  place: z.string().optional().or(z.literal('')),
  signature: z.string().optional().or(z.literal('')),
});

export const ScopeAuthoritySchema = z.object({
  signature1: SignatureBlockSchema,
  signature2: SignatureBlockSchema,
});

export type SignatureBlockValues = z.infer<typeof SignatureBlockSchema>;
export type ScopeAuthorityValues = z.infer<typeof ScopeAuthoritySchema>;
