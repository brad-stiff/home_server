export type User = {
  id: number
  active: 0 | 1
  email: string
  first_name: null | string
  last_name: null | string
  avatar_img_str: string
  created_at: Date
  updated_at: Date
}

export type UserRequest = {
  id?: number
  email_search_str?: string
  name_search_string?: string
}

export type UserLevel = {
  id: 'admin' | 'basic'
  display_name: string
  active: 0 | 1
}
