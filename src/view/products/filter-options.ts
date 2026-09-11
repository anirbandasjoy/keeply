export const TYPE_FILTER_OPTIONS = [
  { value: "", label: "All types" },
  { value: "warranty", label: "Warranty" },
  { value: "guarantee", label: "Guarantee" },
  { value: "subscription", label: "Subscription" },
]

export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
]

export const SORT_OPTIONS = [
  { value: "expires_asc", label: "Soonest expiry" },
  { value: "expires_desc", label: "Latest expiry" },
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
]
