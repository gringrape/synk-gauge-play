import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, FileText, Save } from "lucide-react";
import CylindricalGauge from "@/components/CylindricalGauge";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const [percentage, setPercentage] = useState(0);
  const [showMemoPage, setShowMemoPage] = useState(false);

  const handleAdd = () => {
    setPercentage((prev) => Math.min(100, prev + 10));
  };

  const handleMultiply = () => {
    setPercentage((prev) => Math.min(100, prev * 1.5));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 pb-12">
      {/* Fixed Header */}
      <motion.div 
        className="w-full max-w-md text-center pt-8 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-primary mb-2">SynkTank</h1>
        <motion.p 
          key={showMemoPage ? "memo" : "main"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-muted-foreground"
        >
          {showMemoPage ? "Choose your memo type" : "Fill the tank with your actions"}
        </motion.p>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-between">
        <AnimatePresence mode="wait">
          {!showMemoPage ? (
            <motion.div
              key="main-content"
              className="w-full flex flex-col items-center justify-between flex-1"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y < -100) {
                  setShowMemoPage(true);
                }
              }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >

              {/* Action Buttons */}
              <div className="flex gap-6 w-full max-w-md justify-center mt-8">
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
              </div>

              {/* Gauge */}
              <div className="w-full flex-1 flex items-center justify-center">
                <CylindricalGauge percentage={percentage} />
              </div>

              {/* Swipe indicator */}
              <div className="text-muted-foreground text-sm">
                위로 스와이프하여 메모 페이지로
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="memo-content"
              className="w-full flex flex-col items-center justify-between flex-1"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  setShowMemoPage(false);
                }
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Memo Buttons */}
              <div className="flex flex-col gap-6 w-full max-w-md justify-center flex-1">
                <Button
                  size="lg"
                  className="h-32 rounded-2xl bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg hover:shadow-[0_0_20px_hsl(140_75%_50%/0.4)] transition-all duration-300 text-2xl font-bold flex items-center justify-center gap-4"
                >
                  <FileText className="w-10 h-10" />
                  임시메모
                </Button>

                <Button
                  size="lg"
                  className="h-32 rounded-2xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300 text-2xl font-bold flex items-center justify-center gap-4"
                >
                  <Save className="w-10 h-10" />
                  영구메모
                </Button>
              </div>

              {/* Swipe indicator */}
              <div className="text-muted-foreground text-sm">
                아래로 스와이프하여 돌아가기
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
