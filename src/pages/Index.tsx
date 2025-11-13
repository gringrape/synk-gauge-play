import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import CylindricalGauge from "@/components/CylindricalGauge";
import { motion } from "framer-motion";

const Index = () => {
  const [percentage, setPercentage] = useState(0);

  const handleAdd = () => {
    setPercentage((prev) => Math.min(100, prev + 10));
  };

  const handleMultiply = () => {
    setPercentage((prev) => Math.min(100, prev * 1.5));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6 pb-12">
      {/* Header */}
      <motion.div 
        className="w-full max-w-md text-center pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-primary mb-2">SynkTank</h1>
        <p className="text-muted-foreground">Fill the tank with your actions</p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="flex gap-6 w-full max-w-md justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          onClick={handleAdd}
          size="lg"
          className="flex-1 h-32 rounded-2xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300 text-4xl font-bold"
        >
          <Plus className="w-16 h-16" />
        </Button>

        <Button
          onClick={handleMultiply}
          size="lg"
          className="flex-1 h-32 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground shadow-lg hover:shadow-[0_0_20px_hsl(30_100%_60%/0.4)] transition-all duration-300 text-4xl font-bold"
        >
          <X className="w-16 h-16" />
        </Button>
      </motion.div>

      {/* Gauge */}
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <CylindricalGauge percentage={percentage} />
      </motion.div>
    </div>
  );
};

export default Index;
