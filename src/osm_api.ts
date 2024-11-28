const baseurl: string = "https://nominatim.openstreetmap.org/search?q="

let headersList = {
    Accept: "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
};

let responseJson  = {
    street: "empty",
    house_number: "empty",
    zip: "empty",
    lat: "empty",
    long: "empty"
}


const endurl = "&format=json&polygon=1&addressdetails=1"

export async function getOsmData(address: String) {
    //let complete_url = baseurl + number + "+" + address.replace(" ", "+") + "+" + city + endurl
    let complete_url = baseurl+ address.replace(" ", "+") + endurl

    //console.log(complete_url)

    let response = await fetch(complete_url, {
        method: "GET",
        headers: headersList,
    });

    //console.log(response)
    let data = await response.text()

    let OSMData = JSON.parse(data)
    if (!OSMData){
        
    }

    responseJson.street = OSMData[0]?.address.road
    responseJson.house_number = OSMData[0]?.address.house_number
    responseJson.zip = OSMData[0]?.address.postcode
    responseJson.lat = OSMData[0]?.lat
    responseJson.long = OSMData[0]?.lon

    console.log(responseJson)
    return responseJson
    //console.log(JSONdata[0].lat + "    " + JSONdata[0].lon)
}


//getOsmData("gatower straße 18")