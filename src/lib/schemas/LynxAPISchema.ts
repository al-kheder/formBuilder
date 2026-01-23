import { z } from 'zod';

const LynxRightsSchema = z.object({
  viewOnly: z.boolean().default(false),
  transfer: z.boolean().default(false),
  trading: z.boolean().default(false),
  staking: z.boolean().default(false),
});

const APIRightsSchema = z.object({
  viewOnly: z.boolean().default(false),
  whitelist: z.boolean().default(false),
  transfer: z.boolean().default(false),
  tradingRest: z.boolean().default(false),
  stakingRest: z.boolean().default(false),
  tradingFix: z.boolean().default(false),
});

export const LynxPersonSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  firstname: z.string().optional(),
  email: z.string().email({ message: 'Invalid email format' }).optional().or(z.literal('')),
  phone: z.string().regex(/^[\d\s\+\-\(\)]*$/, { message: 'Phone number can only contain digits, spaces, +, -, ( )' }).optional(),
  rights: LynxRightsSchema,
});

export const APIPersonSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  firstname: z.string().optional(),
  email: z.string().email({ message: 'Invalid email format' }).optional().or(z.literal('')),
  phone: z.string().regex(/^[\d\s\+\-\(\)]*$/, { message: 'Phone number can only contain digits, spaces, +, -, ( )' }).optional(),
  rights: APIRightsSchema,
});

export const LynxAPISchema = z.object({
  addLynxPersons: z.array(LynxPersonSchema),
  updateLynxPersons: z.array(LynxPersonSchema),
  removeLynxPersons: z.array(LynxPersonSchema),
  addAPIPersons: z.array(APIPersonSchema),
  updateAPIPersons: z.array(APIPersonSchema),
  removeAPIPersons: z.array(APIPersonSchema),
});

export type LynxPersonValues = z.infer<typeof LynxPersonSchema>;
export type APIPersonValues = z.infer<typeof APIPersonSchema>;
export type LynxAPIValues = z.infer<typeof LynxAPISchema>;
