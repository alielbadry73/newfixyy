-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('customer', 'staff');

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff table
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT CHECK (service_type IN ('electricity', 'plumbing')),
  current_location_lat DECIMAL,
  current_location_lng DECIMAL,
  is_available BOOLEAN DEFAULT true,
  monthly_earnings DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  service_category TEXT CHECK (service_category IN ('electricity', 'plumbing')),
  customer_location_lat DECIMAL,
  customer_location_lng DECIMAL,
  address TEXT,
  agreed_price DECIMAL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create todo items table for customers
CREATE TABLE public.customer_todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_todos ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Customers can view their own data" 
ON public.customers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Customers can update their own data" 
ON public.customers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert their own data" 
ON public.customers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for staff
CREATE POLICY "Staff can view their own data" 
ON public.staff 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Staff can update their own data" 
ON public.staff 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Staff can insert their own data" 
ON public.staff 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can view staff data" 
ON public.staff 
FOR SELECT 
TO authenticated
USING (true);

-- Create policies for bookings
CREATE POLICY "Customers can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "Staff can view their assigned bookings" 
ON public.bookings 
FOR SELECT 
USING (staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()));

CREATE POLICY "Customers can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

CREATE POLICY "Staff can update their bookings" 
ON public.bookings 
FOR UPDATE 
USING (staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()));

-- Create policies for customer todos
CREATE POLICY "Customers can manage their todos" 
ON public.customer_todos 
FOR ALL 
USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_todos_updated_at
BEFORE UPDATE ON public.customer_todos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();