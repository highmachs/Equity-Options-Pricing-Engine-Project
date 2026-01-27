import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Shield, 
  Target,
  Activity,
  History as HistoryIcon,
  Loader2,
  HelpCircle,
  Terminal,
  Trash2,
  Zap,
  Cpu,
  Database,
  Calculator,
  Binary,
  Maximize2,
  RefreshCw,
  CheckCircle2,
  Search,
  Server,
  Network
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest } from "@/lib/queryClient";

type ComputationStage = 'IDLE' | 'INIT' | 'MARKET_DATA' | 'VOL_SURFACE' | 'PDE_SOLVE' | 'GREEKS' | 'COMPLETE';

// Move CinematicOverlay OUTSIDE to prevent re-creation on every render
const CinematicOverlay = ({ stage, logs }: { stage: ComputationStage; logs: string[] }) => {
  const isMining = stage !== 'IDLE' && stage !== 'COMPLETE';
  const isComplete = stage === 'COMPLETE';

  if (stage === 'IDLE') return null;

  return (
    <AnimatePresence>
      <motion.div 
        key="overlay"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center font-mono overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
           {/* Enhanced Matrix Rain */}
           <div className="grid grid-cols-24 gap-1 p-4 h-full">
              {Array.from({length: 96}).map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 1000, opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 + Math.random() * 5, delay: Math.random() * 2 }}
                    className="text-sm font-bold text-[#a9ba7d] text-center writing-vertical-lr"
                  >
                      {Math.random().toString(2).substring(2, 10)}
                  </motion.div>
              ))}
           </div>
        </div>

        <div className="relative w-full max-w-5xl aspect-video border border-[#a9ba7d]/20 bg-[#0c0e09] shadow-[0_0_150px_rgba(169,186,125,0.15)] flex flex-col overflow-hidden rounded-lg">
           
           {/* Top Bar */}
           <div className="flex items-center justify-between px-8 py-4 border-b border-[#a9ba7d]/10 bg-[#12140e]">
              <h2 className="text-xl font-black text-[#a9ba7d] tracking-[0.4em] uppercase flex items-center gap-4">
                 <Server className={`w-5 h-5 ${isMining ? 'animate-pulse text-yellow-500' : 'text-[#a9ba7d]'}`} /> 
                 Processing Core
              </h2>
              <div className="flex items-center gap-6 text-base font-bold text-[#a9ba7d]/50">
                 <span className="flex items-center gap-2"><Cpu className="w-3 h-3" /> THREADS: 32</span>
                 <span className="flex items-center gap-2"><Network className="w-3 h-3" /> LATENCY: 1ms</span>
              </div>
           </div>

           {/* Content Grid */}
           <div className="flex-1 grid grid-cols-12 p-8 gap-8 relative">
              
              {/* Left Column: Stage Visualization */}
              <div className="col-span-5 space-y-6 border-r border-[#a9ba7d]/10 pr-8">
                 {[
                   { id: 'INIT', label: 'System Handshake', icon: Terminal },
                   { id: 'MARKET_DATA', label: 'Market Data Feed', icon: Database },
                   { id: 'VOL_SURFACE', label: 'Vol Calibration', icon: Activity },
                   { id: 'PDE_SOLVE', label: 'Stochastic Solving', icon: Calculator },
                   { id: 'GREEKS', label: 'Risk Sensitivity', icon: Target },
                   { id: 'COMPLETE', label: 'Convergence', icon: CheckCircle2 }
                 ].map((s, idx) => {
                   const isActive = stage === s.id;
                   const isPast = ['INIT', 'MARKET_DATA', 'VOL_SURFACE', 'PDE_SOLVE', 'GREEKS', 'COMPLETE'].indexOf(stage) > idx;
                   return (
                     <motion.div 
                       key={s.id}
                       animate={{ opacity: isActive || isPast ? 1 : 0.3, x: isActive ? 10 : 0 }}
                       className={`flex items-center gap-4 ${isActive ? 'text-[#a9ba7d]' : 'text-white'}`}
                     >
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${isActive ? 'border-[#a9ba7d] bg-[#a9ba7d]/10 text-[#a9ba7d]' : isPast ? 'border-[#a9ba7d] bg-[#a9ba7d] text-black' : 'border-white/10'}`}>
                           {isPast ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-base font-black uppercase tracking-widest">{s.label}</span>
                           {isActive && <span className="text-xs text-[#a9ba7d]/60 animate-pulse">PROCESSING...</span>}
                        </div>
                     </motion.div>
                   )
                 })}
              </div>

              {/* Center/Right: Cinematic Output */}
              <div className="col-span-7 flex flex-col relative">
                
                {/* Visualizer Area */}
                <div className="flex-1 flex items-center justify-center relative border border-[#a9ba7d]/10 bg-black/50 rounded-lg overflow-hidden mb-6">
                   {stage === 'PDE_SOLVE' && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[#a9ba7d] opacity-20 text-9xl font-serif italic">∫</div>
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-[40px] border-dashed border-[#a9ba7d]/5 rounded-full"
                        />
                     </div>
                   )}
                   
                   {isComplete ? (
                     <motion.div 
                       initial={{ scale: 0.5, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className="flex flex-col items-center gap-4"
                     >
                        <CheckCircle2 className="w-24 h-24 text-[#a9ba7d] drop-shadow-[0_0_15px_rgba(169,186,125,0.8)]" />
                        <span className="text-2xl font-black uppercase tracking-[0.5em] text-white">Resolved</span>
                     </motion.div>
                   ) : (
                     <div className="font-mono text-center space-y-4">
                        <div className="text-4xl font-black text-[#a9ba7d]">
                          {stage === 'MARKET_DATA' && "FETCHING"}
                          {stage === 'VOL_SURFACE' && "CALIBRATING"}
                          {stage === 'PDE_SOLVE' && "INTEGRATING"}
                          {stage === 'GREEKS' && "DERIVING"}
                          {stage === 'INIT' && "INITIALIZING"}
                        </div>
                        <div className="text-xs text-[#a9ba7d]/50 max-w-xs mx-auto">
                          {stage === 'PDE_SOLVE' && "Solving Black-Scholes-Merton Partial Differential Equation using Crank-Nicolson finite difference method..."}
                        </div>
                     </div>
                   )}
                </div>

                {/* Live Console Log */}
                <div className="h-32 bg-black border border-[#a9ba7d]/20 p-4 font-mono text-sm text-[#a9ba7d] overflow-hidden flex flex-col-reverse rounded-lg shadow-inner">
                   {logs.map((log, i) => (
                      <motion.div key={`${i}-${log}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                         <span className="opacity-40 select-none mr-2">root@quant-engine:~#</span>
                         {log}
                      </motion.div>
                   ))}
                </div>

              </div>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
};

export default function Dashboard() {
  const { toast } = useToast();
  const [ticker, setTicker] = useState("AAPL");
  const [strike, setStrike] = useState<number>(260);
  const [expiry, setExpiry] = useState<number>(0.25);
  const [rate, setRate] = useState<number>(0.045);
  const [quantity, setQuantity] = useState<number>(1);
  const [isManualSpot, setIsManualSpot] = useState(false);
  const [manualSpot, setManualSpot] = useState<number>(260);
  const [volatilityOverride, setVolatilityOverride] = useState<number>(0.3);
  
  const [logs, setLogs] = useState<string[]>([]);
  const [activeCalculation, setActiveCalculation] = useState<any>(null);
  
  // Cinematic State
  const [stage, setStage] = useState<ComputationStage>('IDLE');
  const [overlayLogs, setOverlayLogs] = useState<string[]>([]);

  // Cinematic Logs
  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const addOverlayLog = (msg: string) => {
    setOverlayLogs(prev => [msg, ...prev.slice(0, 8)]);
  };

  const { data: history = [], isLoading: loadingHistory } = useQuery<any[]>({
    queryKey: [api.options.history.path],
  });

  const calculateMutation = useMutation({
    mutationFn: async (vars: any) => {
      setStage('INIT');
      setOverlayLogs([]);
      addOverlayLog(`Initializing secure handshake with Python Quant Engine...`);
      await new Promise(r => setTimeout(r, 600));

      setStage('MARKET_DATA');
      addOverlayLog(`Connecting to Reuters/Bloomberg Data Feed...`);
      addOverlayLog(`Pulling Ticker: ${vars.ticker}`);
      await new Promise(r => setTimeout(r, 800));

      setStage('VOL_SURFACE');
      addOverlayLog(`Constructing Implied Volatility Surface...`);
      addOverlayLog(`Interpolating Cubic Splines...`);
      await new Promise(r => setTimeout(r, 800));

      setStage('PDE_SOLVE');
      addOverlayLog(`Loading Black-Scholes Solver...`);
      addOverlayLog(`Integrating dV/dt + 0.5σ²S²d²V/dS²...`);
      
      const res = await apiRequest("POST", api.options.calculate.path, vars);
      const data = await res.json();
      
      setStage('GREEKS');
      addOverlayLog(`Calculating First & Second Order Sensitivities...`);
      addOverlayLog(`Deriving Delta, Gamma, Theta, Vega...`);
      await new Promise(r => setTimeout(r, 800));

      return data;
    },
    onSuccess: (data) => {
      setStage('COMPLETE');
      addOverlayLog(`SUCCESS: Model Converged.`);
      addOverlayLog(`Output: Call@${data.calculation.callPrice.toFixed(2)} | Put@${data.calculation.putPrice.toFixed(2)}`);
      
      queryClient.invalidateQueries({ queryKey: [api.options.history.path] });
      setActiveCalculation(data);
      addLog(`CALCULATION COMPLETE. HEDGE PARAMETERS GENERATED.`);
      
      // Keep "Success" screen for a moment
      setTimeout(() => {
         setStage('IDLE');
         toast({ title: "Analysis Complete", description: "Pricing engine output received.", duration: 3000 });
      }, 1500);
    },
    onError: (e) => {
      setStage('IDLE');
      addLog(`ERROR: COMPUTATION FAILED. ${e}`);
      toast({ title: "System Error", description: "Engine failed to converge.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/options/history/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.options.history.path] });
      toast({ title: "Record Deleted", description: "Archived calculation removed." });
    }
  });

  const handleCalculate = () => {
    calculateMutation.mutate({
      ticker,
      strikePrice: Number(strike),
      timeToExpiry: Number(expiry),
      riskFreeRate: Number(rate),
      quantity: Number(quantity),
      isManualSpot,
      manualSpotPrice: Number(manualSpot),
      volatilityOverride: Number(volatilityOverride),
    });
  };

  const currentResult = activeCalculation;

  const generatePayoffData = () => {
    if (!currentResult) return [];
    const s = isManualSpot ? manualSpot : currentResult.calculation.spotPrice;
    const k = currentResult.calculation.strikePrice;
    const q = currentResult.calculation.quantity || 1;
    const premium = currentResult.calculation.callPrice;
    const data = [];
    const range = s * 0.35;
    const start = Math.max(0, s - range);
    const end = s + range;
    
    for (let price = start; price <= end; price += range/50) {
      const profit = (Math.max(0, price - k) - premium) * 100 * q;
      data.push({ price: price.toFixed(2), profit: Number(profit.toFixed(2)) });
    }
    return data;
  };

  const setFromHistory = (item: any) => {
    setTicker(item.ticker);
    setStrike(item.strikePrice);
    setExpiry(item.timeToExpiry);
    setRate(item.riskFreeRate);
    setQuantity(item.quantity || 1);
    setIsManualSpot(item.isManualSpot || false);
    if(item.manualSpotPrice) setManualSpot(item.manualSpotPrice);
    setVolatilityOverride(item.volatility || 0.3);
    
    setActiveCalculation({
      calculation: item,
      riskSummary: `Historical Load: ${item.ticker} @ Strike ${item.strikePrice}.`, 
      hedgeAction: {
        exposure: item.callDelta * 100 * (item.quantity || 1),
        shares: Math.round(item.callDelta * 100 * (item.quantity || 1)),
        action: "SELL"
      }
    });
  };

  return (
    <TooltipProvider>
      <CinematicOverlay stage={stage} logs={overlayLogs} />
      
      <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20">
        
        {/* SIDEBAR: History & Logs */}
        <aside className="w-96 border-r border-border bg-card p-8 flex flex-col gap-8 shadow-2xl z-20 flex-shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <HistoryIcon className="w-5 h-5 text-primary" />
               <h2 className="text-base font-black uppercase tracking-[0.3em] text-foreground/80">Operation Log</h2>
             </div>
             <Button variant="ghost" size="sm" onClick={() => history.forEach((h:any) => deleteMutation.mutate(h.id))} className="text-base text-muted-foreground hover:text-destructive transition-colors">
               CLEAR_ALL
             </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {loadingHistory && <div className="text-center py-10 opacity-50"><Loader2 className="animate-spin inline" /></div>}
            {!loadingHistory && history.length === 0 && <div className="text-center py-20 opacity-30 text-base uppercase tracking-widest">No Historical Data</div>}
            
            {history.map((item: any) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="group cursor-pointer"
                onClick={() => setFromHistory(item)}
              >
                <div className="p-4 rounded-sm border border-border bg-background/50 hover:bg-accent/50 hover:border-primary/50 transition-all">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-black text-primary">{item.ticker}</span>
                    <span className="text-sm font-mono text-muted-foreground">{new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <div>Strike: <span className="text-foreground">{item.strikePrice}</span></div>
                    <div>Expiry: <span className="text-foreground">{item.timeToExpiry}</span></div>
                    <div>Vol: <span className="text-foreground">{(item.volatility * 100).toFixed(1)}%</span></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* System Console */}
          <div className="h-64 flex flex-col gap-3 pt-6 border-t border-border">
             <div className="flex items-center gap-2 text-base font-black uppercase tracking-[0.2em] text-foreground/60">
               <Terminal className="w-3 h-3" /> System Output
             </div>
             <div className="flex-1 bg-black rounded-sm p-4 font-mono text-sm space-y-1.5 overflow-hidden relative">
               <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
               {logs.map((log, i) => (
                 <div key={i} className="text-primary/80 truncate">
                   <span className="opacity-50 mr-2">{">"}</span>{log}
                 </div>
               ))}
               {logs.length === 0 && <span className="opacity-30">System Ready...</span>}
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-background/50 relative">
          <div className="max-w-7xl mx-auto p-16 space-y-20">
            
            {/* Header */}
            <div className="flex justify-between items-end pb-8 border-b border-border">
               <div>
                 <h1 className="text-6xl font-black tracking-tighter text-foreground mb-4">
                   EQUITY<span className="text-primary">ENGINE</span>
                 </h1>
                 <p className="text-sm font-medium text-muted-foreground tracking-[0.4em] uppercase">Advanced Derivatives Pricing Terminal</p>
               </div>
               <div className="flex items-center gap-8 text-sm font-black uppercase tracking-widest text-muted-foreground">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live_Feed</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Connected</div>
               </div>
            </div>

            {/* INPUT MATRIX */}
            <section className="space-y-8">
               <div className="flex items-center gap-2 text-base font-black uppercase tracking-[0.2em] text-primary">
                 <Database className="w-4 h-4" /> Parameter Configuration
               </div>
               
               <Card className="rounded-sm border border-border shadow-md bg-card/50 backdrop-blur-sm">
                 <CardContent className="p-10">
                   <div className="grid grid-cols-6 gap-x-12 gap-y-10">
                      
                      {/* Row 1 */}
                      <div className="col-span-2 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Underlying Ticker</Label>
                          <Tooltip>
                            <TooltipTrigger><HelpCircle className="w-3 h-3 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" /></TooltipTrigger>
                            <TooltipContent className="bg-zinc-950 border-zinc-800 text-zinc-300 text-xs max-w-[200px]">
                              The symbol of the stock or asset you want to analyze (e.g., AAPL, TSLA).
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} className="h-14 text-2xl font-black tracking-widest border-border bg-background/50 focus:border-primary transition-all" maxLength={5} />
                      </div>

                      <div className="col-span-2 space-y-4">
                        <div className="flex justify-between">
                           <Label className="text-sm uppercase tracking-widest text-muted-foreground font-bold">Spot Price (S)</Label>
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-muted-foreground">OVERRIDE</span>
                             <Switch checked={isManualSpot} onCheckedChange={setIsManualSpot} />
                           </div>
                        </div>
                        <Input type="number" value={manualSpot} onChange={e => setManualSpot(parseFloat(e.target.value))} disabled={!isManualSpot} className={`h-14 text-2xl font-black border-border bg-background/50 ${!isManualSpot && "opacity-30"}`} />
                      </div>

                      <div className="col-span-2 space-y-4">
                        <Label className="text-sm uppercase tracking-widest text-muted-foreground font-bold">Quantity (Contracts)</Label>
                        <Input type="number" value={quantity} onChange={e => setQuantity(parseFloat(e.target.value))} className="h-14 text-2xl font-black border-border bg-background/50 text-foreground" />
                      </div>

                      {/* Row 2 */}
                      <div className="col-span-2 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Strike Price (K)</Label>
                          <Tooltip>
                            <TooltipTrigger><HelpCircle className="w-3 h-3 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" /></TooltipTrigger>
                            <TooltipContent className="bg-zinc-950 border-zinc-800 text-zinc-300 text-xs max-w-[200px]">
                              The fixed price at which the owner of the option can buy (call) or sell (put) the underlying security.
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Input type="number" value={strike} onChange={e => setStrike(parseFloat(e.target.value))} className="h-14 text-2xl font-black border-border bg-background/50" />
                      </div>

                      <div className="col-span-2 space-y-4">
                         <div className="flex items-center gap-2 mb-2">
                           <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Expiry (Years)</Label>
                           <Tooltip>
                            <TooltipTrigger><HelpCircle className="w-3 h-3 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" /></TooltipTrigger>
                            <TooltipContent className="bg-zinc-950 border-zinc-800 text-zinc-300 text-xs max-w-[200px]">
                              Time remaining until the option contract expires, expressed in years (e.g., 0.5 = 6 months).
                            </TooltipContent>
                          </Tooltip>
                         </div>
                        <Input type="number" step="0.01" value={expiry} onChange={e => setExpiry(parseFloat(e.target.value))} className="h-14 text-2xl font-black border-border bg-background/50" />
                      </div>

                      <div className="col-span-2 space-y-4">
                         <div className="flex items-center gap-2 mb-2">
                           <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Volatility (σ)</Label>
                           <Tooltip>
                            <TooltipTrigger><HelpCircle className="w-3 h-3 text-muted-foreground/50 hover:text-primary transition-colors cursor-help" /></TooltipTrigger>
                            <TooltipContent className="bg-zinc-950 border-zinc-800 text-zinc-300 text-xs max-w-[200px]">
                              Implied Volatility (IV): The market's forecast of a likely movement in the security's price. Higher IV = Higher Option Prices.
                            </TooltipContent>
                          </Tooltip>
                         </div>
                        <Input type="number" step="0.01" value={volatilityOverride} onChange={e => setVolatilityOverride(parseFloat(e.target.value))} className="h-14 text-2xl font-black border-border bg-background/50 text-primary" />
                      </div>

                   </div>

                   <div className="mt-12 flex justify-end">
                      <Button onClick={handleCalculate} disabled={calculateMutation.isPending} className="h-20 px-12 text-lg font-black uppercase tracking-[0.3em] rounded-sm bg-primary text-black hover:bg-primary/90 shadow-[0_0_20px_rgba(169,186,125,0.4)] transition-all active:scale-95 group">
                         {calculateMutation.isPending ? "COMPUTING..." : "EXECUTE PRICING MODEL"} <Zap className="ml-4 w-4 h-4 fill-black group-hover:scale-125 transition-transform" />
                      </Button>
                   </div>
                 </CardContent>
               </Card>
            </section>

            {/* RESULTS VIEW */}
            <AnimatePresence>
               {currentResult && (
                 <motion.div initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} className="space-y-16">
                    
                    {/* PRICING CARDS */}
                    <div className="grid grid-cols-2 gap-12">
                       <Card className="rounded-sm border border-l-4 border-l-primary border-border bg-card shadow-xl overflow-hidden relative group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp className="w-24 h-24" /></div>
                          <CardContent className="p-10 space-y-6">
                             <div className="text-sm font-black uppercase tracking-[0.4em] text-primary">Call Option Value</div>
                             <div className="text-8xl font-black tracking-tighter flex items-start gap-2">
                               <span className="text-2xl mt-2 opacity-50">$</span>{currentResult.calculation.callPrice.toFixed(2)}
                             </div>
                             <div className="h-1 w-20 bg-primary/20" />
                          </CardContent>
                       </Card>

                       <Card className="rounded-sm border border-l-4 border-l-purple-500 border-border bg-card shadow-xl overflow-hidden relative group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingDown className="w-24 h-24" /></div>
                          <CardContent className="p-10 space-y-6">
                             <div className="text-sm font-black uppercase tracking-[0.4em] text-purple-500">Put Option Value</div>
                             <div className="text-8xl font-black tracking-tighter flex items-start gap-2">
                               <span className="text-2xl mt-2 opacity-50">$</span>{currentResult.calculation.putPrice.toFixed(2)}
                             </div>
                             <div className="h-1 w-20 bg-purple-500/20" />
                          </CardContent>
                       </Card>
                    </div>

                    {/* PAYOFF & GREEKS */}
                    <div className="grid grid-cols-12 gap-12">
                       <Card className="col-span-8 rounded-sm border border-border bg-card p-8">
                          <div className="flex justify-between items-center mb-8">
                             <h3 className="text-base font-black uppercase tracking-[0.3em] flex items-center gap-3">
                               <Activity className="w-4 h-4 text-primary" /> PnL PROJECTION
                             </h3>
                          </div>
                          <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={generatePayoffData()}>
                                <defs>
                                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a9ba7d" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#a9ba7d" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <XAxis dataKey="price" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                <RechartsTooltip 
                                  contentStyle={{backgroundColor: '#09090b', borderColor: '#333', borderRadius: 0}}
                                  itemStyle={{color: '#a9ba7d', fontFamily: 'monospace'}}
                                />
                                <Area type="monotone" dataKey="profit" stroke="#a9ba7d" strokeWidth={3} fill="url(#g1)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                       </Card>

                       <div className="col-span-4 space-y-6">
                          {[
                            { name: "Delta", val: currentResult.calculation.callDelta, desc: "Directional Risk" },
                            { name: "Gamma", val: 0.042, desc: "Convexity" }, // Placeholder
                            { name: "Vega", val: currentResult.calculation.callVega, desc: "Volatility Sensitivity" },
                            { name: "Theta", val: currentResult.calculation.callTheta, desc: "Time Decay" }
                          ].filter(g => g.name !== 'Gamma').map(g => (
                            <Card key={g.name} className="rounded-sm border border-border bg-card hover:bg-accent/10 transition-colors p-6">
                               <div className="flex justify-between items-start mb-2">
                                  <div className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">{g.name}</div>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-950 border-zinc-800 text-zinc-300 text-xs max-w-[200px] p-3 leading-relaxed">
                                      <span className="font-bold text-primary block mb-1">{g.name}</span>
                                      {g.desc}.
                                      <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                                        {g.name === 'Delta' && "Example: Delta 0.50 means option moves $0.50 for every $1.00 stock move."}
                                        {g.name === 'Vega' && "Example: Vega 0.10 means option price changes by $0.10 for every 1% change in volatility."}
                                        {g.name === 'Theta' && "Example: Theta -0.05 means option loses $0.05 of value per day due to time decay."}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                               </div>
                               <div className="text-3xl font-black font-mono tracking-tighter">{g.val?.toFixed(4)}</div>
                               <div className="mt-2 h-1 w-full bg-secondary overflow-hidden">
                                  <motion.div 
                                    initial={{width: 0}} 
                                    animate={{width: `${Math.abs(g.val * 100)}%`}} 
                                    className="h-full bg-primary" 
                                  />
                               </div>
                            </Card>
                          ))}
                       </div>
                    </div>

                    {/* RISK REPORT */}
                    <Card className="rounded-sm border-t-4 border-t-red-500 border-border bg-card p-12 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 text-[100px] leading-none font-black text-red-500 opacity-5 pointer-events-none select-none">RISK</div>
                       <div className="relative z-10 flex gap-12">
                          <div className="w-1/3 border-r border-border pr-12">
                             <div className="text-sm font-black uppercase tracking-[0.3em] text-red-500 mb-4">Required Hedge</div>
                             <div className="text-5xl font-black tracking-tighter text-foreground mb-2">
                               {currentResult.hedgeAction.shares} <span className="text-lg text-muted-foreground font-medium">SHARES</span>
                             </div>
                             <div className="text-sm font-bold bg-red-500/10 text-red-500 inline-block px-3 py-1 rounded-sm mt-2">
                               {currentResult.hedgeAction.action} UNDERLYING
                             </div>
                          </div>
                          <div className="w-2/3">
                             <div className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Strategic Assessment</div>
                             <p className="text-xl leading-relaxed font-medium text-foreground/80">
                                "{currentResult.riskSummary}"
                              </p>
                          </div>
                       </div>
                    </Card>

                 </motion.div>
               )}
            </AnimatePresence>
            
            <footer className="text-center py-12 text-sm font-black uppercase tracking-[0.4em] text-muted-foreground/30">
               Secure Connection • TLS 1.3 • Latency 14ms
            </footer>

          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `}} />
    </TooltipProvider>
  );
}
