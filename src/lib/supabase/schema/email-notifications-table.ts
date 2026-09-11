import type { NotificationStatus, ReminderType } from "./enums"

export type EmailNotificationsTable = {
  Row: {
    id: string
    user_id: string
    product_id: string
    reminder_type: ReminderType
    subject: string
    status: NotificationStatus
    provider_message_id: string | null
    sent_at: string | null
    error_message: string | null
    created_at: string
  }
  Insert: {
    id?: string
    user_id: string
    product_id: string
    reminder_type: ReminderType
    subject: string
    status?: NotificationStatus
    provider_message_id?: string | null
    sent_at?: string | null
    error_message?: string | null
    created_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    product_id?: string
    reminder_type?: ReminderType
    subject?: string
    status?: NotificationStatus
    provider_message_id?: string | null
    sent_at?: string | null
    error_message?: string | null
    created_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "email_notifications_user_id_fkey"
      columns: ["user_id"]
      isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "email_notifications_product_id_fkey"
      columns: ["product_id"]
      isOneToOne: false
      referencedRelation: "products"
      referencedColumns: ["id"]
    },
  ]
}
