import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svbgohfiilcvoxtvhybx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2YmdvaGZpaWxjdm94dHZoeWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTI3NzksImV4cCI6MjA3ODQyODc3OX0.FMQbL1YU3z0lqdhzh__Svz6CmxU7EVtZUSes4YPJ97c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'apikey': supabaseAnonKey
    }
  }
});


/**
 * Uploads a file to the 'images' bucket in Supabase Storage.
 * @param file The file to upload.
 * @returns A promise that resolves with the public URL of the uploaded image.
 */
export const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('images') // Ensure you have a bucket named 'images'
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return { data: { publicUrl: '' }, error: uploadError };
    }

    const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

    return { data: { publicUrl: data.publicUrl }, error: null };
};