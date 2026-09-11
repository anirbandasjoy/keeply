import type {
  NotificationStatus,
  ProductStatus,
  ProductType,
  ReminderType,
} from "./schema/enums"
import type { EmailNotificationsTable } from "./schema/email-notifications-table"
import type { ProductsTable } from "./schema/products-table"

export type Database = {
  public: {
    Tables: {
      products: ProductsTable
      email_notifications: EmailNotificationsTable
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      product_type: ProductType
      product_status: ProductStatus
      reminder_type: ReminderType
      notification_status: NotificationStatus
    }
    CompositeTypes: Record<string, never>
  }
}
