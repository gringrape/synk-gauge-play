import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Memo {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const TemporaryMemoList = () => {
  const navigate = useNavigate();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    try {
      const { data, error } = await supabase
        .from("temporary_memos")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setMemos(data || []);
    } catch (error) {
      console.error("Error loading memos:", error);
      toast.error("메모 목록을 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = async () => {
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

  const handleDeleteMemo = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from("temporary_memos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMemos(memos.filter(memo => memo.id !== id));
      toast.success("메모가 삭제되었습니다");
    } catch (error) {
      console.error("Error deleting memo:", error);
      toast.error("메모 삭제에 실패했습니다");
    }
  };

  const handleMemoClick = (id: string) => {
    navigate(`/memo/${id}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  const getPreviewText = (content: string) => {
    if (!content || content.trim() === "") return "빈 메모";
    return content.length > 100 ? content.substring(0, 100) + "..." : content;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
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
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
          >
            <Plus className="h-5 w-5 mr-2" />
            새 메모
          </Button>
        </div>

        {memos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#222] mb-4">메모가 없습니다</p>
            <Button
              onClick={handleCreateNew}
              className="bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
            >
              첫 메모 만들기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {memos.map((memo, index) => (
              <motion.div
                key={memo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-background/50 border-border/50"
                  onClick={() => handleMemoClick(memo.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-[#222] whitespace-pre-wrap break-words">
                        {getPreviewText(memo.content)}
                      </p>
                      <p className="text-sm text-[#222]/60 mt-2">
                        {formatDate(memo.updated_at)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteMemo(memo.id, e)}
                      className="hover:bg-destructive/10 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemporaryMemoList;
