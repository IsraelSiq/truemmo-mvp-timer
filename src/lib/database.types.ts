/**
 * Auto-generated types from Supabase schema.
 * Re-generate with: npx supabase gen types typescript --project-id YOUR_ID
 *
 * For now this is a manual stub — update after running migrations.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          group_id: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      groups: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['groups']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['groups']['Insert']>
      }
      kill_log: {
        Row: {
          id: string
          mvp_id: string
          killed_at: string
          killed_by_user_id: string
          killed_by_name: string
          group_id: string
          window_start: string
          window_end: string
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['kill_log']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['kill_log']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
