import { z } from 'zod';

export const PersonRowSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  firstname: z.string().optional(),
  email: z.string().email({ message: 'Invalid email format' }).optional().or(z.literal('')),
  phone: z.string().regex(/^[\d\s\+\-\(\)]*$/, { message: 'Phone number can only contain digits, spaces, +, -, ( )' }).optional(),
});

export const WalletBankSchema = z.object({
  addPersons: z.array(PersonRowSchema),
  updatePersons: z.array(PersonRowSchema),
  removePersons: z.array(PersonRowSchema),
});

export type PersonRowValues = z.infer<typeof PersonRowSchema>;
export type WalletBankValues = z.infer<typeof WalletBankSchema>;
