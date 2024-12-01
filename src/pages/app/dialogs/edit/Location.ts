import { Location } from '../../../../model/location'

export function pullLocationData(address: Location): Location {
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
  address.name = nameInput?.value ?? ''
  address.description = descInput?.value ?? ''
  address.lat = latInput?.value ?? ''
  address.lon = lonInput?.value ?? ''
  address.address.street = streetInput?.value ?? ''
  address.address.zipcode = zipInput?.value ?? ''
  address.address.city = cityInput?.value ?? ''
  return address
}

export function createEmptyLocation(): Location {
  return {
    name: '',
    description: '',
    lat: '',
    lon: '',
    address: {
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
    category: {
      id: '',
      text: '',
      color: '',
    },
    tags: [],
  }
}
