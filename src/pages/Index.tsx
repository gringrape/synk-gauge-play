import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, X, FileText, Save } from "lucide-react";
import CylindricalGauge from "@/components/CylindricalGauge";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(0);
  const [showMemoPage, setShowMemoPage] = useState(false);

  const handleAdd = async () => {
    // Create new temporary memo and navigate to it
    try {
      const { data, error } = await supabase
        .from("temporary_memos")
        .insert({ content: "" })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        navigate(`/memo/${data.id}`);
      }
    } catch (error) {
      console.error("Error creating memo:", error);
      toast.error("메모 생성에 실패했습니다");
    }
  };

  const handleMultiply = async () => {
    // Get random temporary memo
    try {
      const { data, error } = await supabase
        .from("temporary_memos")
        .select("*");

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error("임시메모가 없습니다");
        return;
      }

      // Select random memo
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomMemo = data[randomIndex];

      navigate(`/memo/${randomMemo.id}`);
    } catch (error) {
      console.error("Error loading random memo:", error);
      toast.error("메모를 불러오는데 실패했습니다");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 pb-12">
      {/* Fixed Header */}
      <motion.div
        className="w-full max-w-md text-center pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-2 text-[#222]">SynkTank</h1>
        <AnimatePresence mode="wait">
          {showMemoPage && (
            <motion.p
              key="memo-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-muted-foreground"
            >
              With your team
            </motion.p>
          ) || (
            <motion.p
              key="memo-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-muted-foreground"
            >
              Sync your brain
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!showMemoPage ? (
            <motion.div
              key="main-content"
              className="w-full h-auto flex flex-col items-center justify-center flex-1 gap-8"
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
              {/* Action Buttons - Center */}
              <div className="translate-y-[-2em] flex gap-6 w-full max-w-md justify-center">

                <Button
                  onClick={handleMultiply}
                  size="lg"
                  className="flex-1 h-32 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground shadow-lg hover:shadow-[0_0_20px_hsl(30_100%_60%/0.4)] transition-all duration-300 text-4xl font-bold"
                >
                  x
                </Button>

                <Button
                  onClick={handleAdd}
                  size="lg"
                  className="flex-1 h-32 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-primary-foreground shadow-lg transition-all duration-300 text-4xl font-bold"
                >
                  +
                </Button>
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
                  onClick={() => navigate("/memos")}
                  size="lg"
                  className="h-32 rounded-2xl bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg hover:shadow-[0_0_20px_hsl(140_75%_50%/0.4)] transition-all duration-300 text-2xl font-bold flex items-center justify-center gap-4"
                >
                  Temporary
                </Button>

                <Button
                  onClick={() => navigate("/permanent-memos")}
                  size="lg"
                  className="h-32 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-primary-foreground shadow-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300 text-2xl font-bold flex items-center justify-center gap-4"
                >
                  Permanent
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
