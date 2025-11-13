-- Create temporary memos table
CREATE TABLE public.temporary_memos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.temporary_memos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read memos (for now, until auth is added)
CREATE POLICY "Anyone can view temporary memos" 
ON public.temporary_memos 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to create memos
CREATE POLICY "Anyone can create temporary memos" 
ON public.temporary_memos 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to update memos
CREATE POLICY "Anyone can update temporary memos" 
ON public.temporary_memos 
FOR UPDATE 
USING (true);

-- Create policy to allow anyone to delete memos
CREATE POLICY "Anyone can delete temporary memos" 
ON public.temporary_memos 
FOR DELETE 
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_temporary_memos_updated_at
BEFORE UPDATE ON public.temporary_memos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for temporary_memos table
ALTER TABLE public.temporary_memos REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.temporary_memos;