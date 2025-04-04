import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseUserFormSchema = z.object({
  username: z.string().min(1).max(255),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  jobTitle: z.string().max(255).optional().or(z.literal('')),
  phoneNumber: z.string().max(255).optional().or(z.literal('')),
  enabled: z.boolean(),
  allowNotifications: z.boolean().optional(),
  password: z.string().optional(),
  timezone: z.string().optional().or(z.literal('')),
  homeFacilityId: z.string().optional().or(z.literal('')),
  emailDetails: z.object({
    email: z.string().email().optional(),
    emailVerified: z.boolean().optional(),
  }),
  roleAssignments: z
    .array(
      z.object({
        roleId: z.string(),
        roleName: z.string().optional(),
        type: z.string().optional(),
        warehouseId: z.string().optional(),
        warehouseName: z.string().optional(),
        supervisoryNodeId: z.string().optional(),
        supervisoryNodeName: z.string().optional(),
        programId: z.string().optional(),
        programName: z.string().optional(),
      })
    )
    .optional(),
});

export type BaseUserFormData = z.infer<typeof baseUserFormSchema>;
