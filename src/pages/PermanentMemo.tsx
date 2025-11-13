import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const PermanentMemo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      loadMemo();
    }
  }, [id]);

  const loadMemo = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("permanent_memos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setContent(data.content || "");
      }
    } catch (error) {
      console.error("Error loading memo:", error);
      toast.error("메모를 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemo = async (newContent: string) => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from("permanent_memos")
        .update({ content: newContent })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating memo:", error);
      toast.error("메모 저장에 실패했습니다");
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);

    // Debounce the update to avoid too many database calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      updateMemo(value);
    }, 500);
  };

  const handleBack = () => {
    navigate("/permanent-memos");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <p className="text-[#222]">로딩중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5 text-[#222]" />
          </Button>
          <h1 className="text-2xl font-bold text-[#222]">영구 메모</h1>
        </div>

        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="메모를 입력하세요..."
          className="min-h-[500px] bg-background/50 border-border/50 focus:border-primary resize-none text-[#222]"
        />

        <p className="text-sm text-[#222] mt-2">
          자동으로 저장됩니다
        </p>
      </div>
    </div>
  );
};

export default PermanentMemo;
