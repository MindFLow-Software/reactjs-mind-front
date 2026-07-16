export type ISessionRawResponse = {
  message: string
  user: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    status?: string
    role?: string
    profileImageUrl: string | null
  }
}
