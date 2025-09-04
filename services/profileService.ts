import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export class ProfileService {
  static async updateProfile(
    userId: string,
    updates: { full_name?: string; avatar_url?: string }
  ) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  static async uploadAvatar(userId: string, fileUri: string) {
    try {
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: 'base64',
      });

      const filePath = `${userId}/${new Date().getTime()}.png`;
      const contentType = 'image/png';

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(base64), { contentType });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      return { publicUrl: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Upload avatar service error:', error);
      return { publicUrl: null, error };
    }
  }
}
