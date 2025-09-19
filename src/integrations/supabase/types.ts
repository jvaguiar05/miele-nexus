export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          anotacoes_anteriores: string | null
          atividades: string | null
          bairro: string | null
          cargo: string | null
          cep: string | null
          cnae: string | null
          cnpj: string
          complemento: string | null
          created_at: string
          email_comercial: string | null
          email_contato: string | null
          id: string
          logradouro: string | null
          municipio: string | null
          nome_fantasia: string
          nova_anotacao: string | null
          numero: string | null
          quadro_societario: string | null
          razao_social: string
          recuperacao_judicial: boolean | null
          regime_tributario: string | null
          responsavel_financeiro: string | null
          site: string | null
          telefone_comercial: string | null
          telefone_contato: string | null
          tipo_empresa: string
          uf: string | null
          updated_at: string
        }
        Insert: {
          anotacoes_anteriores?: string | null
          atividades?: string | null
          bairro?: string | null
          cargo?: string | null
          cep?: string | null
          cnae?: string | null
          cnpj: string
          complemento?: string | null
          created_at?: string
          email_comercial?: string | null
          email_contato?: string | null
          id?: string
          logradouro?: string | null
          municipio?: string | null
          nome_fantasia: string
          nova_anotacao?: string | null
          numero?: string | null
          quadro_societario?: string | null
          razao_social: string
          recuperacao_judicial?: boolean | null
          regime_tributario?: string | null
          responsavel_financeiro?: string | null
          site?: string | null
          telefone_comercial?: string | null
          telefone_contato?: string | null
          tipo_empresa?: string
          uf?: string | null
          updated_at?: string
        }
        Update: {
          anotacoes_anteriores?: string | null
          atividades?: string | null
          bairro?: string | null
          cargo?: string | null
          cep?: string | null
          cnae?: string | null
          cnpj?: string
          complemento?: string | null
          created_at?: string
          email_comercial?: string | null
          email_contato?: string | null
          id?: string
          logradouro?: string | null
          municipio?: string | null
          nome_fantasia?: string
          nova_anotacao?: string | null
          numero?: string | null
          quadro_societario?: string | null
          razao_social?: string
          recuperacao_judicial?: boolean | null
          regime_tributario?: string | null
          responsavel_financeiro?: string | null
          site?: string | null
          telefone_comercial?: string | null
          telefone_contato?: string | null
          tipo_empresa?: string
          uf?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      perdcomps: {
        Row: {
          client_id: string
          competencia: string
          created_at: string
          data_transmissao: string | null
          id: string
          imposto: string
          numero: string
          observacoes: string | null
          status: string
          updated_at: string
          valor_recebido: number | null
          valor_solicitado: number
        }
        Insert: {
          client_id: string
          competencia: string
          created_at?: string
          data_transmissao?: string | null
          id?: string
          imposto: string
          numero: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          valor_recebido?: number | null
          valor_solicitado?: number
        }
        Update: {
          client_id?: string
          competencia?: string
          created_at?: string
          data_transmissao?: string | null
          id?: string
          imposto?: string
          numero?: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          valor_recebido?: number | null
          valor_solicitado?: number
        }
        Relationships: [
          {
            foreignKeyName: "perdcomps_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
