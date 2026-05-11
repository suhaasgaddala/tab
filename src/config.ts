import "dotenv/config";
import { z } from "zod";

const optionalNonEmptyString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const booleanFromEnv = z
  .union([z.boolean(), z.string()])
  .optional()
  .default("false")
  .transform((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  });

const positiveIntegerFromEnv = (fallback: number) =>
  z
    .union([z.number(), z.string()])
    .optional()
    .default(String(fallback))
    .transform((value, ctx) => {
      const parsed = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Expected a positive integer, received ${String(value)}`
        });
        return z.NEVER;
      }

      return parsed;
    });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: positiveIntegerFromEnv(3000),
  PUBLIC_URL: optionalNonEmptyString,
  JSON_BODY_LIMIT: z.string().trim().default("1mb"),

  ANTHROPIC_API_KEY: optionalNonEmptyString,
  OPENAI_API_KEY: optionalNonEmptyString,
  VOYA_MOCK_AI: booleanFromEnv.default("true"),
  ANTHROPIC_HAIKU_MODEL: z.string().trim().default("claude-haiku-4-5"),
  ANTHROPIC_SONNET_MODEL: z.string().trim().default("claude-sonnet-4-6"),
  ANTHROPIC_OPUS_MODEL: z.string().trim().default("claude-opus-4-7"),
  MODEL_PROVIDER_TIMEOUT_MS: positiveIntegerFromEnv(60_000),
  MAX_INPUT_CHARS: positiveIntegerFromEnv(50_000),
  MAX_OUTPUT_TOKENS: positiveIntegerFromEnv(2_000)
});

export type AppConfig = ReturnType<typeof loadConfig>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`Invalid environment configuration: ${details.join("; ")}`);
  }

  const value = parsed.data;

  return {
    nodeEnv: value.NODE_ENV,
    port: value.PORT,
    publicUrl: value.PUBLIC_URL,
    jsonBodyLimit: value.JSON_BODY_LIMIT,
    anthropic: {
      apiKey: value.ANTHROPIC_API_KEY,
      models: {
        "claude-haiku": value.ANTHROPIC_HAIKU_MODEL,
        "claude-sonnet": value.ANTHROPIC_SONNET_MODEL,
        "claude-opus": value.ANTHROPIC_OPUS_MODEL
      },
      timeoutMs: value.MODEL_PROVIDER_TIMEOUT_MS
    },
    openai: {
      apiKey: value.OPENAI_API_KEY
    },
    voya: {
      mockAi: value.VOYA_MOCK_AI || (!value.ANTHROPIC_API_KEY && !value.OPENAI_API_KEY)
    },
    maxInputChars: value.MAX_INPUT_CHARS,
    maxOutputTokens: value.MAX_OUTPUT_TOKENS
  };
}

export const config = loadConfig();
