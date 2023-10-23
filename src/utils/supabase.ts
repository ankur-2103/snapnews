import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_BASE_URI;
const supabaseKey = import.meta.env.VITE_TOKEN;

// create supabse client
export const supabase = createClient(supabaseUrl, supabaseKey);