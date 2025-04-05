export interface SearchParams {
  model?: string
  brand?: string
  price?: string
  term?: 'long_term' | 'short_term'
  type?: 'car' | 'motorbike' | 'van'
  position: {
    location: {
      latitude: number
      longitude: number
    }
    radius: number
  }
}

export enum Variant {
  neutral = 'neutral',
  success = 'success',
  danger = 'danger',
}

export enum Level {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
}
