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

let OSMTimeoutID: number
let streetStringOld: string

streetInput.onkeyup = async () => {
    let streetString: string = streetInput.value
    //introduce timeout to this and reduce limit
    if (streetString == streetStringOld){
        return;
    }
    console.log(streetString)
    window.clearTimeout(OSMTimeoutID)
    streetStringOld = streetString


    if (streetString.length < 5) {
        locationAutocomplete.style["display"] = "none"
        return 
    }

    //store timeout in var 
    //every call do the cleartimeout and reinvoke it
    
    
    OSMTimeoutID = window.setTimeout( async () => {
        OSM = await getOsmData(streetString)
        locationAutocomplete.style["display"] = "block";
        loc1text.textContent =  OSM.street + " " + OSM.house_number + " " + OSM.zip
    }, 1000)
    

    
}

streetInput.addEventListener("onkeydown", ()  => {
    alert("test")
    locationAutocomplete.style["display"] = "block"
});