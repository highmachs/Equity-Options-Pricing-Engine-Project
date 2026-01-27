import { z } from "zod";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  options: {
    calculate: {
      method: 'POST' as const,
      path: '/api/options/calculate',
      input: z.object({
        ticker: z.string().min(1).max(5),
        strikePrice: z.number().optional(),
        timeToExpiry: z.number().optional(),
        riskFreeRate: z.number().optional(),
        quantity: z.number().optional(),
        manualSpotPrice: z.number().optional(),
        isManualSpot: z.boolean().optional(),
        volatilityOverride: z.number().optional(),
      }),
      responses: {
        200: z.any(), // Will return CalculationResponse structure
        400: errorSchemas.validation,
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/options/history',
      responses: {
        200: z.array(z.any()), // Array of OptionCalculation
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
