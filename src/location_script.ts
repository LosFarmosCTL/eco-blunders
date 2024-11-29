import { getOsmData } from './osm_api.ts'
import { OSMResult } from './osm_api.ts'

//get all the HTML elems here
const streetInput =
  document.body.querySelector<HTMLInputElement>('#street-input')
const locationAutocomplete =
  document.body.querySelector<HTMLElement>('#loc_autocomplete')
const zipInput = document.body.querySelector<HTMLInputElement>('#zip-input')
const cityInput = document.body.querySelector<HTMLInputElement>('#city-input')
const latInput = document.body.querySelector<HTMLInputElement>('#lat-input')
const lonInput = document.body.querySelector<HTMLInputElement>('#lon-input')

const testData = [] as unknown as [OSMResult]

testData.push({
  address: {
    road: 'Gatower Straße',
    house_number: '18',
    postcode: '13595',
    city: 'Berlin',
  },
  lat: '52.5423',
  lon: '13.432',
})

let OSMTimeoutID: number

streetInput?.addEventListener('input', function () {
  const streetString: string = streetInput.value
  //introduce timeout to this and reduce limit
  window.clearTimeout(OSMTimeoutID)

  if (streetString.length < 5) {
    locationAutocomplete?.classList.add('hidden')
    return
  }

  //store timeout in var
  //every call do the cleartimeout and reinvoke it

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  OSMTimeoutID = window.setTimeout(async () => {
    const OSM = await getOsmData(streetString)
    locationAutocomplete?.classList.remove('hidden')
    createListChilren(OSM)
  }, 1000)
})

function createListChilren(OSM: [OSMResult]) {
  OSM.forEach((place) => {
    //console.log("adding" + place.address.road + "to list")
    const li = document.createElement('li')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    li.classList.add('list-none', 'cursor-pointer', 'osm-list-elem')
    p1.textContent = place.address.road + ' ' + place.address.house_number
    p2.textContent = place.address.postcode + ' ' + place.address.city
    li.appendChild(p1)
    li.appendChild(p2)
    li.addEventListener('click', () => {
      autoFillData(place)
    })
    locationAutocomplete?.appendChild(li)
  })
}

function autoFillData(OSM: OSMResult) {
  if (latInput) latInput.value = OSM.lat
  if (lonInput) lonInput.value = OSM.lon
  if (zipInput) zipInput.value = OSM.address.postcode
  if (streetInput)
    streetInput.value = OSM.address.road + ' ' + OSM.address.house_number
  if (cityInput) cityInput.value = OSM.address.city
  locationAutocomplete?.classList.add('hidden')

  //removes all children
  if (locationAutocomplete) locationAutocomplete.textContent = ''
}
