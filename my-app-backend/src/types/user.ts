export type User = {
  id: number
  active: 0 | 1
  user_level: UserLevel['id']
  email: string
  first_name: null | string
  last_name: null | string
  avatar_img_data: null | string
  created_at: Date
  updated_at: Date
}

export type UserRequest = {
  id?: number
  active?: 0 | 1
  email_search_str?: string
  name_search_str?: string
  exact_match?: 0 | 1
}

export type UserLevel = {
  id: 'admin' | 'basic'
  display_name: string
  active: 0 | 1
}

export type UserRegisterRequest = {
  email: string
  password: string
}
