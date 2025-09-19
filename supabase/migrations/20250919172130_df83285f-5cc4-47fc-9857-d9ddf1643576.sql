-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.activity_logs;

-- Create a new policy that allows anyone to view activity logs (for testing)
CREATE POLICY "Anyone can view activity logs" 
ON public.activity_logs 
FOR SELECT 
USING (true);

-- Keep the existing INSERT policy for consistency
DROP POLICY IF EXISTS "Users can create their own activity logs" ON public.activity_logs;
CREATE POLICY "Users can create activity logs" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (true);