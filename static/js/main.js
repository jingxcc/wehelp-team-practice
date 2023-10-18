// -----  Get all cities' weather info from api -----
const getWeatherInfo = async (location) => {
    try {
        let//
        response = await fetch(`/api/weathers?locationName=${location}`),
        result = await response.json(),
        data = await result["data"];
        return data
    }
    catch(error) {
        console.log(error);
        throw (error)
    }
}


// ----- set global variables -----
var// 
// weatherInfo = getWeatherInfo("臺北市"),
dogPics = {
    "台北市": "background-1.jpg",
    "新北市": "background-2.jpg",
    "桃園市": "background-3.jpg",
    "台中市": "background-4.jpg",
    "台南市": "background-5.jpg",
    "高雄市": "background-6.jpg"
},
// cityIndex = {
//     "台北市": 6,
//     "新北市": 7,
//     "桃園市": 8,
//     "台中市": 9,
//     "台南市": 10,
//     "高雄市": 11
// },
weatherIconDict = {
    "晴天": "day-clear.png",
    "陰天": "day-cloudy.png",
    "雨天": "day-partially-with-rain.png",
    "雷雨": "day-thunderstorm.png",
    "有霧": "day-fog.png",
    "下雪": "day-snowing.png"
};


// ----- Change weather as location changes -----
const changeTextContent = (cssSelector, content) => {
    let element = document.querySelector(cssSelector);
    element.textContent = content;
};


const changeWeather = async (cityChosen) => {
    // fetch location weather info
    let weatherInfo = await getWeatherInfo(cityChosen);

    // update cute dog picture
    backgroundImg = document.querySelector(".background-image");
    backgroundImg.style.backgroundImg = `url('../background_images/${dogPics[cityChosen]}')`;

    // update time_part
    let currentTime = new Date();
    changeTextContent(".date", `${currentTime.getMonth()}/${currentTime.getDate()}`);
    changeTextContent(".time", `${currentTime.getHours()} : ${currentTime.getMinutes()}`);

    // update rainpercentage
    changeTextContent(".rainpercentage", weatherInfo[1]["value"]);

    // update weather
    let//
    weatherIcon = document.querySelector(".weathericon");
    weatherIcon.style.backgroundImg = `url('../weather_icon/${weatherIconDict[weatherInfo[0]["value"]]}')`;
    
    changeTextContent(".weathertext", weatherInfo[0]["value"]);
    changeLocation(".comfort", weatherInfo[2]["value"]);

    // update day_temperature
    changeTextContent(".max_temperature", weatherInfo[4]["value"]);
    changeTextContent(".min_temperature", weatherInfo[3]["value"]);

    // update now_temperature
    changeTextContent(".temperature_degree", weatherInfo[5]["value"]);
}


// ----- set default weather information in Taipei ----
changeWeather("臺北市");


// ----- add click event to location options -----
let locationOptions = document.querySelectorAll(".opt");
locationOptions.forEach(option => {
    option.addEventListener("click", () => {
        changeWeather(option.textContent)
    })
});


// ----- e-paper: subscribe function -----
const subscribeEpaper = async() => {
    let//
    discordEndpoint = document.querySelector("").value,
    locationForSubcription = document.querySelector("").value;

    try {
        let response = await fetch("/api/e_paper", {
            method: "POST",
            body: JSON.stringify({
                "city": locationForSubcription,
                "webhookUrl": discordEndpoint
            })
        });

        let result = await response.json();

        if (!response.ok) {
            console.log(result.description);
            throw("Subscription failed.");
        };

        return("Subscription succeeded.")
    }
    catch(error) {
        console.log(error);
        throw (error)
    }
}


// ----- e-paper: update function -----
const updateEpaper = async() => {
    let//
    discordEndpoint = document.querySelector("").value,
    locationForSubcription = document.querySelector("").value;

    try {
        let response = await fetch("/api/e_paper", {
            method: "PATCH",
            body: JSON.stringify({
                "city": locationForSubcription,
                "webhookUrl": discordEndpoint
            })
        });

        let result = await response.json();

        if (!response.ok) {
            console.log(result.description);
            throw("Update failed.");
        };

        return("Update succeeded.")
    }
    catch(error) {
        console.log(error);
        throw (error)
    }   
}


// ----- e-paper: delete function -----
const deleteEpaper = async() => {
    let discordEndpoint = document.querySelector("").value;

    try {
        let response = await fetch("/api/e_paper", {
            method: "DELETE",
            body: JSON.stringify({
                "webhookUrl": discordEndpoint
            })
        });

        let result = await response.json();

        if (!response.ok) {
            console.log(result.description);
            throw("Delete failed.");
        };

        return("Delete succeeded.")
    }
    catch(error) {
        console.log(error);
        throw (error)
    }   
}


// ----- add click event for Epaper-----
let// 
subscribeBtn = document.querySelector(".subscribe-btn"),
updateBtn = document.querySelector("."),
deleteBtn = document.querySelector(".");

subscribeBtn.addEventListener("click", subscribeEpaper);
updateBtn.addEventListener("click", updateEpaper);
deleteBtn.addEventListener("click", deleteEpaper);