import { env } from "@/env"

export type IProvider = 'google' | 'linkedin'

export class Authenticate {
  static async Oauth(provider: IProvider) {
    return window.location.href = `${env.VITE_API_URL}/auth/${provider}`
  }
}
