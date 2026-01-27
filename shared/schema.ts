import { pgTable, text, serial, doublePrecision, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const optionCalculations = pgTable("option_calculations", {
  id: serial("id").primaryKey(),
  ticker: text("ticker").notNull(),
  spotPrice: doublePrecision("spot_price").notNull(),
  strikePrice: doublePrecision("strike_price").notNull(),
  timeToExpiry: doublePrecision("time_to_expiry").notNull(),
  riskFreeRate: doublePrecision("risk_free_rate").notNull(),
  volatility: doublePrecision("volatility").notNull(),
  isManualSpot: boolean("is_manual_spot").default(false),
  manualSpotPrice: doublePrecision("manual_spot_price"),
  quantity: doublePrecision("quantity").notNull().default(1),
  callPrice: doublePrecision("call_price").notNull(),
  putPrice: doublePrecision("put_price").notNull(),
  callDelta: doublePrecision("call_delta").notNull(),
  callVega: doublePrecision("call_vega").notNull(),
  callTheta: doublePrecision("call_theta").notNull(),
  putDelta: doublePrecision("put_delta").notNull(),
  putVega: doublePrecision("put_vega").notNull(),
  putTheta: doublePrecision("put_theta").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOptionCalculationSchema = createInsertSchema(optionCalculations).omit({ 
  id: true, 
  createdAt: true 
});

export type OptionCalculation = typeof optionCalculations.$inferSelect;
export type InsertOptionCalculation = z.infer<typeof insertOptionCalculationSchema>;

// API Contract Types
export interface CalculationRequest {
  ticker: string;
  strikePrice?: number;
  timeToExpiry?: number;
  riskFreeRate?: number;
  quantity?: number;
}

export interface CalculationResponse {
  calculation: OptionCalculation;
  riskSummary: string;
  hedgeAction: {
    exposure: number;
    shares: number;
    action: string;
  };
}
