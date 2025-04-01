import { ALL_RIGHT_TYPES } from '@/lib/constants';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseRoleFormSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(255).optional().or(z.literal('')),
  rights: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(ALL_RIGHT_TYPES),
      attachments: z.array(z.unknown()),
    })
  ),
});

export type BaseRoleFormData = z.infer<typeof baseRoleFormSchema>;
