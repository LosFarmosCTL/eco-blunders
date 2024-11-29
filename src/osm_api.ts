import { request } from './request'

const baseurl = 'https://nominatim.openstreetmap.org/search?q='

const headersList = {
  Accept: '*/*',
  'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
}

const responseJson = {
  street: 'empty',
  house_number: 'empty',
  zip: 'empty',
  lat: 'empty',
  long: 'empty',
}

interface OSMResult {
  address: {
    road: string
    house_number: string
    postcode: string
  }
  lat: string
  lon: string
}

const endurl = '&format=json&polygon=1&addressdetails=1'

export async function getOsmData(address: string) {
  //let complete_url = baseurl + number + "+" + address.replace(" ", "+") + "+" + city + endurl
  const complete_url = baseurl + address.replace(' ', '+') + endurl

  console.log(complete_url)

  //console.log(response)

  const OSMData: [OSMResult] = await request(complete_url, {
    method: 'GET',
    headers: headersList,
  })

  console.log('api request sent')
  //const data = await response.json<[OSMResult]>()

  //const OSMData = JSON.parse(data) as [OSMResult]

  responseJson.street = OSMData[0].address.road
  responseJson.house_number = OSMData[0].address.house_number
  responseJson.zip = OSMData[0].address.postcode
  responseJson.lat = OSMData[0].lat
  responseJson.long = OSMData[0].lon
  //TODO: add city

  return OSMData
  //console.log(JSONdata[0].lat + "    " + JSONdata[0].lon)
}

//getOsmData("gatower straße 18")
