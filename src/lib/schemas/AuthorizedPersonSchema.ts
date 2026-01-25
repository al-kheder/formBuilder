import { z } from 'zod';

export const AuthorizedPersonSchema = z.object({
  clientName: z.string().min(1, { message: 'Client name is required' }),
  action: z.enum(['add', 'update', 'remove', '']),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  idDocument: z.string(),
  nationalities: z.array(z.string())
    .min(1, { message: 'At least one nationality is required' })
    .max(3, { message: 'Maximum of 3 nationalities allowed' }),
  street: z.string(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string(),
  businessEmail: z.string(),
  businessPhone: z.string(),
  mobilePhone: z.string(),
  position: z.string(),
  signaturePower: z.enum(['none', 'sole', 'jointly', '']),
  signature: z.string(),
});

export type AuthorizedPersonValues = z.infer<typeof AuthorizedPersonSchema>;
