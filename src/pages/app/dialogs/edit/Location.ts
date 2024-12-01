export interface Location {
  name: string
  description: string
  location: {
    lat: string
    lon: string
    street: string
    zipcode: string
    city: string
  }
  images: [
    {
      url: string
      alt: string
    },
  ]
  tags: string[]
}

export function pullLocationData(location: Location): Location {
  //define all html elements of the inputs
  const streetInput =
    document.body.querySelector<HTMLInputElement>('#street-input')
  const zipInput = document.body.querySelector<HTMLInputElement>('#zip-input')
  const cityInput = document.body.querySelector<HTMLInputElement>('#city-input')
  const latInput = document.body.querySelector<HTMLInputElement>('#lat-input')
  const lonInput = document.body.querySelector<HTMLInputElement>('#lon-input')
  const nameInput = document.body.querySelector<HTMLInputElement>('#name-input')
  const descInput = document.body.querySelector<HTMLInputElement>('#desc-input')

  //pull data from inputs
  location.name = nameInput?.value ?? ''
  location.description = descInput?.value ?? ''
  location.location.lat = latInput?.value ?? ''
  location.location.lon = lonInput?.value ?? ''
  location.location.street = streetInput?.value ?? ''
  location.location.zipcode = zipInput?.value ?? ''
  location.location.city = cityInput?.value ?? ''
  return location
}

export function createEmptyLocation(): Location {
  return {
    name: '',
    description: '',
    location: {
      lat: '',
      lon: '',
      street: '',
      zipcode: '',
      city: '',
    },
    images: [
      {
        url: '',
        alt: '',
      },
    ],
    tags: [],
  }
}
