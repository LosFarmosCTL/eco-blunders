import { Category } from './category'
import { Tag } from './tag'

export interface Location {
  id: string
  name: string
  description: string
  lat: string
  lon: string
  address: {
    street: string
    zipcode: string
    city: string
  }
  images: {
    url: string
    alt: string
  }[]

  category: Category
  tags: Tag[]
}
