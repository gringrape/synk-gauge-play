import { Button } from "@/components/ui/button";
import { FileText, Save } from "lucide-react";
import { motion } from "framer-motion";

interface MemoPageProps {
  onSwipeDown: () => void;
}

const MemoPage = ({ onSwipeDown }: MemoPageProps) => {
  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col items-center justify-between p-6 pb-12"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.y > 100) {
          onSwipeDown();
        }
      }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* Header */}
      <div className="w-full max-w-md text-center pt-8">
        <h1 className="text-5xl font-bold text-primary mb-2">SynkTank</h1>
        <p className="text-muted-foreground">Choose your memo type</p>
      </div>

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
  );
};

export default MemoPage;
