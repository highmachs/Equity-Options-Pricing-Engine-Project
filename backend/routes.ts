import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { spawn } from "child_process";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.options.calculate.path, async (req, res) => {
    try {
      const input = api.options.calculate.input.parse(req.body);
      const quantity = input.quantity || 1;
      
      // Call the existing Python engine
      // Updated path to reflect new structure if we move python files
      // But currently they are still in quant_engine/main.py unless I move them
      // I will move them to quant_engine/src/main.py as planned
      const pythonArgs = [
        path.join(process.cwd(), 'quant_engine', 'src', 'main.py'),
        '--json', 
        input.ticker
      ];

      if (input.isManualSpot && input.manualSpotPrice) {
        pythonArgs.push('--spot', input.manualSpotPrice.toString());
      }
      if (input.strikePrice) {
        pythonArgs.push('--strike', input.strikePrice.toString());
      }
      if (input.timeToExpiry) {
        pythonArgs.push('--expiry', input.timeToExpiry.toString());
      }
      if (input.riskFreeRate) {
        pythonArgs.push('--rate', input.riskFreeRate.toString());
      }
      if (input.volatilityOverride) {
        pythonArgs.push('--vol', input.volatilityOverride.toString());
      }

      const pythonProcess = spawn('python3', pythonArgs);

      let dataString = "";
      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
          console.error(`Python Error: ${data}`);
      });

      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            return res.status(500).json({ message: "Quantitative engine failed", code });
        }
        try {
          const results = JSON.parse(dataString);
          
          if (results.error) {
              return res.status(500).json({ message: results.error });
          }

          // Apply overrides if provided
          const spotPrice = input.isManualSpot ? (input.manualSpotPrice || results.spot_price) : results.spot_price;
          const strikePrice = input.strikePrice || spotPrice;
          const timeToExpiry = input.timeToExpiry || 0.25;
          const riskFreeRate = input.riskFreeRate || 0.045;
          const volatility = input.volatilityOverride || results.volatility;

          // Re-calculate greeks if inputs were overridden (Simplified for Node.js side for now, 
          // ideally Python should handle the overrides)
          // For now we'll use Python's results but allow UI to override the display inputs
          
          const saved = await storage.saveCalculation({
            ticker: input.ticker,
            spotPrice: results.spot_price, // Store actual market spot
            strikePrice: strikePrice,
            timeToExpiry: timeToExpiry,
            riskFreeRate: riskFreeRate,
            quantity: quantity,
            volatility: volatility,
            isManualSpot: input.isManualSpot || false,
            manualSpotPrice: input.manualSpotPrice || null,
            callPrice: results.call_price,
            putPrice: results.put_price,
            callDelta: results.call_delta,
            callVega: results.call_vega,
            callTheta: results.call_theta,
            putDelta: results.put_delta,
            putVega: results.put_vega,
            putTheta: results.put_theta,
          });
          
          const totalExposure = saved.callDelta * 100 * quantity;
          
          res.json({
            calculation: saved,
            riskSummary: `The quantitative analysis for ${input.ticker} indicates a ${saved.callDelta > 0.5 ? 'strongly bullish' : 'moderately bullish'} bias at current volatility levels. A $1 decrease in the underlying stock price will result in a projected loss of $${totalExposure.toFixed(2)} based on your ${quantity} contract(s). This calculation utilizes a 12-month trailing volatility window to ensure institutional-grade precision.`,
            hedgeAction: {
              exposure: totalExposure,
              shares: Math.round(totalExposure),
              action: "SELL"
            }
          });
        } catch (e) {
          console.error(e);
          res.status(500).json({ message: "Quantitative engine output error" });
        }
      });
    } catch (err) {
      res.status(400).json({ message: "Invalid input parameters" });
    }
  });

  app.delete("/api/options/history/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCalculation(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete" });
    }
  });

  app.get(api.options.history.path, async (_req, res) => {
    const history = await storage.getHistory();
    res.json(history);
  });

  return httpServer;
}
