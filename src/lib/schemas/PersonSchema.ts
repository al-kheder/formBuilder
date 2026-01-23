import { z } from 'zod';

export const PersonSchema = z.object({
  action: z.enum(['add', 'update', 'remove', '']).optional(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  idDocument: z.string().regex(/^\d*$/, { message: 'ID document number must contain only numbers' }).optional(),
  nationalities: z.array(z.string())
    .min(1, { message: 'At least one nationality is required' })
    .max(3, { message: 'Maximum of 3 nationalities allowed' }),
  street: z.string().optional(),
  zipCode: z.string().regex(/^\d*$/, { message: 'Zip code must contain only numbers' }).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  businessEmail: z.string().email({ message: 'Invalid email format' }).optional().or(z.literal('')),
  businessPhone: z.string().regex(/^[\d\s\+\-\(\)]*$/, { message: 'Phone number can only contain digits, spaces, +, -, ( )' }).optional(),
  mobilePhone: z.string().regex(/^[\d\s\+\-\(\)]*$/, { message: 'Phone number can only contain digits, spaces, +, -, ( )' }).optional(),
  position: z.string().optional(),
  signaturePower: z.enum(['none', 'sole', 'jointly', '']).optional(),
  signature: z.string().optional(),
});

export type PersonValues = z.infer<typeof PersonSchema>;
