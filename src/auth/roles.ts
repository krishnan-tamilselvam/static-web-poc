/** Entra app role values — must match app registration exactly. */
export const APP_ROLES = {
  Reader: 'Reader',
  OrderManager: 'OrderManager',
  Admin: 'Admin',
} as const

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES]

export const ALL_APP_ROLES: AppRole[] = [
  APP_ROLES.Reader,
  APP_ROLES.OrderManager,
  APP_ROLES.Admin,
]
