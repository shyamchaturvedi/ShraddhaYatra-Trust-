import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svbgohfiilcvoxtvhybx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YmdvaGZpaWxjdm94dHZoeWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTI3NzksImV4cCI6MjA3ODQyODc3OX0.FMQbL1YU3z0lqdhzh__Svz6CmxU7EVtZUSes4YPJ97c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to upload an image to Supabase storage
export const uploadImage = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `profiles/${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return { data, error: null };
};