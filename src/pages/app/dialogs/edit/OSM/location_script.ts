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
const searchInput =
  document.body.querySelector<HTMLInputElement>('#search-input')

const testData = [] as unknown as [OSMResult]

testData.push({
  name: '',
  address: {
    road: 'Gatower Straße',
    house_number: '18',
    postcode: '13595',
    city: 'Berlin',
    town: '',
  },
  lat: '52.5423',
  lon: '13.432',
})

let OSMTimeoutID: number

searchInput?.addEventListener('input', function () {
  const searchString: string = searchInput.value
  clearList()
  //introduce timeout to this and reduce limit
  window.clearTimeout(OSMTimeoutID)
  locationAutocomplete?.classList.add('hidden')

  if (searchString.length < 5) {
    locationAutocomplete?.classList.add('hidden')
    return
  }

  //store timeout in var
  //every call do the cleartimeout and reinvoke it

  OSMTimeoutID = window.setTimeout(async () => {
    clearList()
    const OSM = await getOsmData(searchString)
    if (OSM.length == 0) {
      searchInput.setCustomValidity('No results found')
      searchInput.reportValidity()
      console.log('no results found')
      return
    }
    //if (!checkOsmData(OSM)) locationAutocomplete?.classList.remove('hidden')
    locationAutocomplete?.classList.remove('hidden')
    createListChildren(OSM)
  }, 1000)
})
//TODO: filter out undefindes

//TODO: refactor to search address field, make all other elems readonly
function createListChildren(OSM: OSMResult[]) {
  OSM.forEach((place) => {
    //console.log("adding" + place.address.road + "to list")
    const li = document.createElement('li')
    const p0 = document.createElement('p')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    li.classList.add('list-none', 'cursor-pointer', 'osm-list-elem')

    p1.textContent =
      place.address.road + ' ' + (place.address.house_number ?? '')
    p2.textContent =
      place.address.postcode +
      ' ' +
      (place.address.city ?? place.address.town ?? 'Berlin')
    if (place.name) {
      p0.textContent = place.name
      li.appendChild(p0)
    }
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
    streetInput.value =
      OSM.address.road + ' ' + (OSM.address.house_number ?? '')

  if (cityInput)
    cityInput.value = OSM.address.city ?? OSM.address.town ?? 'Berlin'
  locationAutocomplete?.classList.add('hidden')

  //removes all children
  //clearList()
}

function clearList() {
  console.log('clearing list')
  const locationslist = locationAutocomplete?.children
  if (locationslist) {
    for (const location of locationslist) {
      location.remove()
    }
  }
}

//TODO: tag selecting and shit, image uploading, submit button gives a location interface,
