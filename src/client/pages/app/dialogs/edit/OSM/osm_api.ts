import { request } from '../../../../../util/request'

const baseurl = 'https://nominatim.openstreetmap.org/search?q='

const headersList = {
  Accept: '*/*',
  'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
}

export interface OSMResult {
  name: string | null
  address: {
    road: string
    house_number: string | null
    postcode: string
    city: string | null
    town: string | null
  }
  lat: string
  lon: string
}

const endurl = '&format=json&polygon=1&addressdetails=1'

export async function getOsmData(address: string) {
  const complete_url = baseurl + address.replace(' ', '+') + endurl

  const [OSMData] = await request<OSMResult[]>(complete_url, {
    method: 'GET',
    headers: headersList,
  })

  OSMData.forEach((place) => {
    if (place.name == place.address.road) {
      place.name = null
    }
  })

  return OSMData
}
