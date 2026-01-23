import { z } from 'zod';

export const SignatureBlockSchema = z.object({
  name: z.string().optional(),
  date: z.string().optional(),
  place: z.string().optional(),
  signature: z.string().optional(),
});

export const ScopeAuthoritySchema = z.object({
  signature1: SignatureBlockSchema,
  signature2: SignatureBlockSchema,
});

export type SignatureBlockValues = z.infer<typeof SignatureBlockSchema>;
export type ScopeAuthorityValues = z.infer<typeof ScopeAuthoritySchema>;
