import { request } from '../../../../../util/request'

const baseurl = 'https://nominatim.openstreetmap.org/search?q='

const headersList = {
  Accept: '*/*',
  'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
}

export interface OSMResult {
  address: {
    road: string
    house_number: string
    postcode: string
    city: string
  }
  lat: string
  lon: string
}

const endurl = '&format=json&polygon=1&addressdetails=1'

export async function getOsmData(address: string) {
  const complete_url = baseurl + address.replace(' ', '+') + endurl

  console.log(complete_url)

  //console.log(response)

  const OSMData: OSMResult[] = await request(complete_url, {
    method: 'GET',
    headers: headersList,
  })

  console.log('api request sent')

  return OSMData
}
