const subscribe = async() => {
    let//
    discordEndpoint = document.querySelector("").value,
    locationForSubcription = document.querySelector("").value;

    try {
        let response = await fetch("", {
            method: "POST",
            body: JSON.stringify({
                "discordEndpoint": discordEndpoint,
                "locationForSubcription": locationForSubcription
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

const changeTextContent = (cssSelector, content) => {
    let element = document.querySelector(cssSelector);
    element.textContent = content;
};

const changeLocation = async() => {
    let cityChosen = document.querySelector(".city").textContent;

    // -----  update element textContent - dog image -----
    // cute dog picture
    let//
    dogPics = {
        "臺北市": "background-1",
        "新北市": "background-2",
        "桃園市": "background-3",
        "臺中市": "background-4",
        "臺南市": "background-5",
        "高雄市": "background-6"
    },
    backgroundImg = document.querySelector(".background-image");
    backgroundImg.style.backgroundImg = `url('../backgroung_images/${dogPics[cityChosen]}')`;


    try {
    let//
    response = await fetch(`"/api/weathers"${cityChosen}`),
    result = await response.json(),
    weatherElement = result["data"][0]["weahterElement"];

    if (!response.ok) {
        console.log(result.description);
        throw("Location Change failed.");
    };

    // -----  update element textContent - other parts  -----

    // time_part
    let currentTime = new Date();
    changeTextContent(".date", `${currentTime.getMonth()}/${currentTime.getDate()}`);
    changeTextContent(".time", `${currentTime.getHours()} : ${currentTime.getMinutes()}`);

    // rainpercentage
    changeTextContent(".rainpercentage", weatherElement[1]["value"]);

    // weather
    let//
    weatherIconObj = {},
    weatherIcon = document.querySelector(".weathericon");
    weatherIcon.style.backgroundImg = `url('../weather_icon/${weatherIconObj[weatherElement[0]["value"]]}')`;
    
    changeTextContent(".weathertext", weatherElement[0]["value"]);
    changeLocation(".comfort", weatherElement[2]["value"]);

    // day_temperature
    changeTextContent(".max_temperature", weatherElement[4]["value"]);
    changeTextContent(".min_temperature", weatherElement[3]["value"]);

    // now_temperature
    changeTextContent(".temperature_degree", weatherElement[5]["value"]);

    return("Location Change succeeded.")

    }
    catch(error) {
        console.log(error);
        throw (error)
    }
}