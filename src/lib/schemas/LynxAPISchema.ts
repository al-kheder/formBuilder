import { z } from 'zod';

const LynxRightsSchema = z.object({
  viewOnly: z.boolean(),
  transfer: z.boolean(),
  trading: z.boolean(),
  staking: z.boolean(),
});

const APIRightsSchema = z.object({
  viewOnly: z.boolean(),
  whitelist: z.boolean(),
  transfer: z.boolean(),
  tradingRest: z.boolean(),
  stakingRest: z.boolean(),
  tradingFix: z.boolean(),
});

export const LynxPersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  firstname: z.string(),
  email: z.string(),
  phone: z.string(),
  rights: LynxRightsSchema,
});

export const APIPersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  firstname: z.string(),
  email: z.string(),
  phone: z.string(),
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
