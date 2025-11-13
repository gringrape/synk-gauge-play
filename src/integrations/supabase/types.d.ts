// Temporary generated types to satisfy the compiler. Will be replaced by Cloud.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      temporary_memos: {
        Row: {
          id: string;
          content: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
