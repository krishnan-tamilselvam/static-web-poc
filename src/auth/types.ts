export type AuthClaim = {
  typ: string
  val: string
}

export type ClientPrincipal = {
  identityProvider: string
  userId: string
  userDetails: string
  userRoles: string[]
  claims?: AuthClaim[]
}

export type AuthMeResponse = {
  clientPrincipal: ClientPrincipal | null
}
