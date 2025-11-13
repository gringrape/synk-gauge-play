import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MoveRight } from "lucide-react";
import { toast } from "sonner";

const TemporaryMemo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromAdd = (location.state as any)?.fromAdd;
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
        .from("temporary_memos")
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
        .from("temporary_memos")
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
    navigate("/");
  };

  const handleMoveToPermanent = async () => {
    if (!id) return;

    try {
      // Create permanent memo with current content
      const { error: insertError } = await supabase
        .from("permanent_memos")
        .insert({ content });

      if (insertError) throw insertError;

      // Delete temporary memo
      const { error: deleteError } = await supabase
        .from("temporary_memos")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      toast.success("영구메모로 이동했습니다");
      navigate("/");
    } catch (error) {
      console.error("Error moving to permanent:", error);
      toast.error("영구메모로 이동하는데 실패했습니다");
    }
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5 text-[#222]" />
            </Button>
            <h1 className="text-2xl font-bold text-[#222]">임시 메모</h1>
          </div>
{!fromAdd && (
  <Button
    onClick={handleMoveToPermanent}
    className="bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-primary-foreground"
  >
    <MoveRight className="h-4 w-4 mr-2" />
    영구메모로 이동
  </Button>
)}
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

export default TemporaryMemo;
