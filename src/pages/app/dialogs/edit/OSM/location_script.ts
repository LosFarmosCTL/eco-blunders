import { getOsmData } from './osm_api.ts'
import { OSMResult } from './osm_api.ts'

//get all the HTML elems here
let streetInput = document.body.querySelector<HTMLInputElement>('#street-input')
let locationAutocomplete =
  document.body.querySelector<HTMLElement>('#loc_autocomplete')
let zipInput = document.body.querySelector<HTMLInputElement>('#zip-input')
let cityInput = document.body.querySelector<HTMLInputElement>('#city-input')
let latInput = document.body.querySelector<HTMLInputElement>('#lat-input')
let lonInput = document.body.querySelector<HTMLInputElement>('#lon-input')
let searchInput = document.body.querySelector<HTMLInputElement>('#search-input')

const testData = [] as unknown as [OSMResult]

testData.push({
  name: 'meine wohnung',
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
testData.push({
  name: 'meine wohnung',
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
testData.push({
  name: 'meine wohnung',
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
export function activateLocationScript() {
  streetInput = document.body.querySelector<HTMLInputElement>('#street-input')
  locationAutocomplete =
    document.body.querySelector<HTMLElement>('#loc_autocomplete')
  zipInput = document.body.querySelector<HTMLInputElement>('#zip-input')
  cityInput = document.body.querySelector<HTMLInputElement>('#city-input')
  latInput = document.body.querySelector<HTMLInputElement>('#lat-input')
  lonInput = document.body.querySelector<HTMLInputElement>('#lon-input')
  searchInput = document.body.querySelector<HTMLInputElement>('#search-input')

  console.log('location script loaded')

  searchInput?.addEventListener('input', function () {
    const searchString: string = searchInput?.value ?? ''
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
        //searchInput.setCustomValidity('No results found')
        //searchInput.reportValidity()
        createNoResults()
        console.log('no results found')
        return
      }

      locationAutocomplete?.classList.remove('hidden')
      //createNoResults()
      createListChildren(OSM)
    }, 1000)
  })
}

function createListChildren(OSM: OSMResult[]) {
  OSM.forEach((place) => {
    //console.log("adding" + place.address.road + "to list")
    const listElem = document.createElement('div')
    const p0 = document.createElement('p')
    const p1 = document.createElement('p')
    const p2 = document.createElement('p')
    listElem.classList.add('list-none', 'cursor-pointer', 'osm-list-elem')

    p1.textContent =
      place.address.road + ' ' + (place.address.house_number ?? '')
    p2.textContent =
      place.address.postcode +
      ' ' +
      (place.address.city ?? place.address.town ?? 'Berlin')
    if (place.name) {
      p0.textContent = place.name
      listElem.appendChild(p0)
    }
    listElem.appendChild(p1)
    listElem.appendChild(p2)
    listElem.addEventListener('click', () => {
      autoFillData(place)
    })
    locationAutocomplete?.appendChild(listElem)
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

function createNoResults() {
  locationAutocomplete?.classList.remove('hidden')
  const listElem = document.createElement('div')
  const noResults = document.createElement('p')
  noResults.classList.add('text-center')
  noResults.style.color = 'rgb(235, 107, 107)'
  noResults.style.fontWeight = 'bold'
  listElem.appendChild(noResults)
  noResults.textContent = 'No results found :^('
  listElem.classList.add('list-none', 'cursor-pointer', 'osm-list-elem')
  locationAutocomplete?.appendChild(listElem)
}

//TODO: tag selecting and shit, image uploading, submit button gives a location interface,
