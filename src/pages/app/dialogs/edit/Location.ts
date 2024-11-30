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
  tags: [string]
}

//define all html elements of the inputs
const streetInput =
  document.body.querySelector<HTMLInputElement>('#street-input')
const zipInput = document.body.querySelector<HTMLInputElement>('#zip-input')
const cityInput = document.body.querySelector<HTMLInputElement>('#city-input')
const latInput = document.body.querySelector<HTMLInputElement>('#lat-input')
const lonInput = document.body.querySelector<HTMLInputElement>('#lon-input')
const nameInput = document.body.querySelector<HTMLInputElement>('#name-input')
const descInput = document.body.querySelector<HTMLInputElement>('#desc-input')

export function pullLocationData(): Location {
  return {
    name: nameInput?.value ?? '',
    description: descInput?.value ?? '',
    location: {
      lat: latInput?.value ?? '',
      lon: lonInput?.value ?? '',
      street: streetInput?.value ?? '',
      zipcode: zipInput?.value ?? '',
      city: cityInput?.value ?? '',
    },
    images: [
      {
        url: '',
        alt: '',
      },
    ],
    tags: [''],
  }
}
