import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_CONTRACT_ADDRESS: z
    .string()
    .min(1, 'Contract address is required')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Contract address must be a valid Ethereum address'),
  NEXT_PUBLIC_LIGHTHOUSE_API_KEY: z
    .string()
    .min(1, 'Lighthouse API key is required')
    .min(10, 'Lighthouse API key appears to be too short'),
});

// Validate environment variables
const validateEnv = () => {
  try {
    const env = envSchema.parse({
      NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      NEXT_PUBLIC_LIGHTHOUSE_API_KEY: process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
    });
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Environment validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
};

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
