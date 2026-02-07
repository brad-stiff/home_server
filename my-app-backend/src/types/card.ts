export type Card = {
  id: string
  name: string
  image_uris: {
    small: string
    normal: string
  }
  collector_number: string
  set: string
}

//ScryFall API Types
export type MTGCard = {
  id: string
  name: string
  image_uris: {
    small: string
    normal: string
  }
  collector_number: string
  set: string
}

export type MTGSet = {
  id: string
  name: string
  icon_svg_uri: string
  released_at: string
}
