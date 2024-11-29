import { getOsmData } from './osm_api.ts'

//get all the HTML elems here
const streetInput = document.body.querySelector<HTMLInputElement>('#street')
const locationAutocomplete =
  document.body.querySelector<HTMLElement>('#loc_autocomplete')
const loc1text = document.body.querySelector<HTMLElement>('#loc1')

let OSMTimeoutID: number
let streetStringOld: string

streetInput?.addEventListener('input', function () {
  console.log('change')
  const streetString: string = streetInput.value
  //introduce timeout to this and reduce limit
  if (streetString == streetStringOld) {
    return
  }
  console.log(streetString)
  window.clearTimeout(OSMTimeoutID)
  streetStringOld = streetString

  if (streetString.length < 5) {
    locationAutocomplete?.classList.add('hidden')
    return
  }

  //store timeout in var
  //every call do the cleartimeout and reinvoke it

  OSMTimeoutID = window.setTimeout(async () => {
    const OSM = await getOsmData(streetString)
    locationAutocomplete?.classList.remove('hidden')
    if (loc1text) loc1text.innerHTML = OSM[0].address.road
    //loc1text.textContent = OSM.street + ' ' + OSM.house_number + ' ' + OSM.zip
  }, 1000)
})
