import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_URI;
const supabaseKey = import.meta.env.VITE_TOKEN;

export const supabase = createClient(supabaseUrl, supabaseKey);