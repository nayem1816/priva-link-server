const { z } = require("zod");

const createSecretSchema = z.object({
  body: z.object({
    content: z
      .string({
        required_error: "Secret content is required",
      })
      .min(1, "Secret content cannot be empty")
      .max(50000, "Secret content is too long (max 50,000 characters)"),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .max(100, "Password is too long")
      .optional(),
    expirationHours: z
      .number()
      .refine((val) => [1, 6, 24, 168].includes(val), {
        message: "Expiration must be 1, 6, 24, or 168 hours",
      })
      .optional()
      .default(24),
  }),
});

const revealSecretSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Secret ID is required",
    }),
  }),
  body: z.object({
    password: z.string().optional(),
  }),
});

const checkSecretSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Secret ID is required",
    }),
  }),
});

module.exports = {
  createSecretSchema,
  revealSecretSchema,
  checkSecretSchema,
};
