import { z } from 'zod';

export const PersonRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  firstname: z.string(),
  email: z.string(),
  phone: z.string(),
});

export const WalletBankSchema = z.object({
  addPersons: z.array(PersonRowSchema),
  updatePersons: z.array(PersonRowSchema),
  removePersons: z.array(PersonRowSchema),
});

export type PersonRowValues = z.infer<typeof PersonRowSchema>;
export type WalletBankValues = z.infer<typeof WalletBankSchema>;
