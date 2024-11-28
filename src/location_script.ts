import { getOsmData } from "./osm_api.ts"

//get all the HTML elems here
let streetInput = <HTMLInputElement>document.body.querySelector("#street")
let locationAutocomplete = <HTMLElement>document.body.querySelector('[name="loc_autocomplete"]')
let loc1text = <HTMLElement>document.body.querySelector('[name="loc1"]')


let OSM = {
    street: "empty",
    house_number: "empty",
    zip: "empty",
    lat: "empty",
    long: "empty"
}

streetInput.onkeydown = async () => {
    let streetString: string = streetInput.value
    //introduce timeout to this and reduce limit
    if (streetString.length < 15) {
        locationAutocomplete.style["display"] = "none"
        return 
    }

    OSM = await getOsmData(streetString)
    //console.log(OSM)

    locationAutocomplete.style["display"] = "block";
    loc1text.textContent =  OSM.street + " " + OSM.house_number + " " + OSM.zip
}

streetInput.addEventListener("onkeydown", ()  => {
    alert("test")
    locationAutocomplete.style["display"] = "block"
});