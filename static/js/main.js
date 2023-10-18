// -----  Get all cities' weather info from api -----
const getWeatherInfo = async () => {
    try {
        let//
        response = await fetch("/api/weathers"),
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
weatherInfo = getWeatherInfo(),
dogPics = {
    "臺北市": "background-1",
    "新北市": "background-2",
    "桃園市": "background-3",
    "臺中市": "background-4",
    "臺南市": "background-5",
    "高雄市": "background-6"
},
cityIndex = {
    "臺北市": 6,
    "新北市": 7,
    "桃園市": 8,
    "臺中市": 9,
    "臺南市": 10,
    "高雄市": 11
},
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


const changeWeather = (cityChosen) => {
    // update cute dog picture
    backgroundImg = document.querySelector(".background-image");
    backgroundImg.style.backgroundImg = `url('../background_images/${dogPics[cityChosen]}')`;

    // update time_part
    let currentTime = new Date();
    changeTextContent(".date", `${currentTime.getMonth()}/${currentTime.getDate()}`);
    changeTextContent(".time", `${currentTime.getHours()} : ${currentTime.getMinutes()}`);

    // update rainpercentage
    changeTextContent(".rainpercentage", weatherInfo[cityIndex[cityChosen]][1]["value"]);

    // update weather
    let//
    weatherIcon = document.querySelector(".weathericon");
    weatherIcon.style.backgroundImg = `url('../weather_icon/${weatherIconDict[weatherInfo[cityIndex[cityChosen]][0]["value"]]}')`;
    
    changeTextContent(".weathertext", weatherInfo[cityIndex[cityChosen]][0]["value"]);
    changeLocation(".comfort", weatherInfo[cityIndex[cityChosen]][2]["value"]);

    // update day_temperature
    changeTextContent(".max_temperature", weatherInfo[cityIndex[cityChosen]][4]["value"]);
    changeTextContent(".min_temperature", weatherInfo[cityIndex[cityChosen]][3]["value"]);

    // update now_temperature
    changeTextContent(".temperature_degree", weatherInfo[cityIndex[cityChosen]][5]["value"]);
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
            // render fail msg
        };

        return("Subscription succeeded.")
        // render succes msg
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
            // render fail msg
        };

        return("Update succeeded.")
        // render succes msg
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
            // render fail msg
        };

        return("Delete succeeded.")
        // render succes msg
    }
    catch(error) {
        console.log(error);
        throw (error)
    }   
}