-- Create report_jobs table for tracking report generation
CREATE TABLE public.report_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'queued',
  file_url TEXT,
  file_size INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.report_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Sellers can manage their own report jobs" 
ON public.report_jobs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM sellers 
  WHERE sellers.id = report_jobs.seller_id 
  AND sellers.user_id = auth.uid()
));

-- Add trigger for timestamps
CREATE TRIGGER update_report_jobs_updated_at
BEFORE UPDATE ON public.report_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_orders_seller_id_created_at ON public.orders(seller_id, created_at DESC);
CREATE INDEX idx_products_seller_id_stock ON public.products(seller_id, stock_quantity);
CREATE INDEX idx_reviews_seller_id_created_at ON public.reviews(seller_id, created_at DESC);
CREATE INDEX idx_report_jobs_seller_id_status ON public.report_jobs(seller_id, status);

-- Add updated_at trigger to existing tables that don't have it
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();