-- Create permanent memos table
CREATE TABLE public.permanent_memos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.permanent_memos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read memos
CREATE POLICY "Anyone can view permanent memos" 
ON public.permanent_memos 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to create memos
CREATE POLICY "Anyone can create permanent memos" 
ON public.permanent_memos 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to update memos
CREATE POLICY "Anyone can update permanent memos" 
ON public.permanent_memos 
FOR UPDATE 
USING (true);

-- Create policy to allow anyone to delete memos
CREATE POLICY "Anyone can delete permanent memos" 
ON public.permanent_memos 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_permanent_memos_updated_at
BEFORE UPDATE ON public.permanent_memos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for permanent_memos table
ALTER TABLE public.permanent_memos REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.permanent_memos;