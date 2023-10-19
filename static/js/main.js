// -----  Get all cities' weather info from api -----
const getWeatherInfo = async (location) => {
  try {
    let //
      response = await fetch(`/api/weathers?locationName=${location}`),
      result = await response.json(),
      data = await result["data"][0]["weatherElement"];
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ----- set global variables -----
var //
  dogPics = {
    台北市: "background-1.jpg",
    新北市: "background-2.jpg",
    桃園市: "background-3.jpg",
    台中市: "background-4.jpg",
    台南市: "background-5.jpg",
    高雄市: "background-6.jpg",
  },
  weatherIconsDay = {
    isClear: "day-clear.png",
    isCloudy: "day-cloudy.png",
    isPartiallyClearWithRain: "day-partially-with-rain.png",
    isThunderstorm: "day-thunderstorm.png",
    isFog: "day-fog.png",
    isSnowing: "day-snowing.png",
    isCloudyFog: "day-cloudy-fog.png",
  },
  weatherIconsNight = {
    isClear: "night-clear.png",
    isCloudy: "night-cloudy.png",
    isPartiallyClearWithRain: "night-partially-with-rain.png",
    isThunderstorm: "night-thunderstorm.png",
    isFog: "night-fog.png",
    isSnowing: "night-snowing.png",
    isCloudyFog: "night-cloudy-fog.png",
  };

// ----- create getWeatherImg function -----
var weatherTypes = {
  "15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41": "isThunderstorm",
  1: "isClear",
  "25, 26, 27, 28": "isCloudyFog",
  "2, 3, 4, 5, 6, 7": "isCloudy",
  24: "isFog",
  "8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39":
    "isPartiallyClearWithRain",
  "23, 37, 42": "isSnowing",
};

const getWeatherImg = (wxValueID) => {
  let //
    weatherImg,
    weatherIconsRef = weatherIconsDay,
    currentTime = new Date(),
    hourOfTime = currentTime.getHours();

  if (hourOfTime >= 18) {
    weatherIconsRef = weatherIconsNight;
  }

  Object.keys(weatherTypes).forEach((key) => {
    let keyArray = key.split(", ");
    if (keyArray.includes(wxValueID)) {
      weatherImg = weatherIconsRef[weatherTypes[key]];
    }
  });
  return weatherImg;
};

// ----- Change weather as location changes -----
const changeTextContent = (cssSelector, content) => {
  let element = document.querySelector(cssSelector);
  element.textContent = content;
};

const changeWeather = async (cityChosen) => {
  // fetch location weather info
  let weatherElement = await getWeatherInfo(cityChosen);

  const sectionLeft = document.querySelector(".section2-left");
  sectionLeft.style.visibility = "initial";

  // update location
  changeTextContent(".city", cityChosen);

  // update cute dog picture
  let backgroundImg = document.querySelector("body");
  backgroundImg.style.backgroundImage = `url("static/backgroung_images/${dogPics[cityChosen]}")`;
  // ../backgroung_images/background-1.jpg

  // update time_part
  let currentTime = new Date();
  changeTextContent(
    ".date",
    `${currentTime.getMonth() + 1}/${currentTime.getDate()}`
  );
  let min = currentTime.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  changeTextContent(".time", `${currentTime.getHours()} : ${min}`);

  // update rainpercentage
  changeTextContent(".rainpercentage", weatherElement[1]["value"]);

  // update weather
  let //
    weatherIcon = document.querySelector(".weathericon"),
    weatherImg = getWeatherImg(weatherElement[0]["valueId"]);
  weatherIcon.style.backgroundImage = `url("static/weather_icon/${weatherImg}")`;

  changeTextContent(".weathertext", weatherElement[0]["value"]);
  changeTextContent(".comfort", weatherElement[3]["value"]);

  // update day_temperature
  changeTextContent(".max_temperature", weatherElement[4]["value"]);
  changeTextContent(".min_temperature", weatherElement[2]["value"]);

  // update now_temperature
  changeTextContent(".temperature_degree", weatherElement[5]["value"]);
};

// ----- set default weather information in Taipei ----
changeWeather("台北市");

// ----- add click event to location options -----
let locationOptions = document.querySelectorAll(".opt");
locationOptions.forEach((option) => {
  option.addEventListener("click", () => {
    changeWeather(option.textContent);
  });
});

// ----- e-paper: subscribe function -----
const updateEpaper = async () => {
  let //
    classArray = document
      .querySelector(".wrapper-1")
      .getAttribute("class")
      .split(" "),
    subscribeAlready = classArray.includes("wrapper-hidden");

  // recored a new subscriber
  if (!subscribeAlready) {
    let //
      discordEndpoint = document.querySelector(".wrapper-1 .user-input").value,
      locationForSubcription = document.querySelector(
        ".wrapper-1 .sub-select-btn"
      ).textContent;

    try {
      let response = await fetch("/api/e_paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: locationForSubcription,
          webhookUrl: discordEndpoint,
        }),
      });

      let result = await response.json();

      if (!response.ok) {
        alert("Subscription failed");
        throw "Subscription failed.";
      }

      alert("Subscription succeeds!");

      return "Subscription succeeds.";
    } catch (error) {
      throw error;
    }
  }

  // modify subscriber info
  if (subscribeAlready) {
    let //
      discordEndpoint = document.querySelector(".wrapper-2 .user-input").value,
      locationForSubcription = document.querySelector(
        ".wrapper-2 .sub-select-btn"
      ).textContent;

    try {
      let response = await fetch("/api/e_paper", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: locationForSubcription,
          webhookUrl: discordEndpoint,
        }),
      });

      let result = await response.json();

      if (!response.ok) {
        throw "Subscription failed.";
      }

      alert("Update succeeds!");

      return "Update succeeds.";
    } catch (error) {
      throw error;
    }
  }
};

// ----- e-paper: delete function -----
// const updateEpaper = async() => {
//     let//
//     classArray = document.querySelector(".wrapper-1").getAttribute("class").split(" "),
//     notYetSubscribe = "wrapper-display" in classArray;

//     if (!notYetSubscribe) {
//         let//
//         discordEndpoint = document.querySelector("").value,
//         locationForSubcription = document.querySelector("").value;

//         try {
//             let response = await fetch("/api/e_paper", {
//                 method: "PATCH",
//                 body: JSON.stringify({
//                     "city": locationForSubcription,
//                     "webhookUrl": discordEndpoint
//                 })
//             });

//             let result = await response.json();

//             if (!response.ok) {
//                 console.log(result.description);
//                 throw "Update failed.";
//             };

//             return "Update succeeded.";
//         }
//         catch(error) {
//             console.log(error);
//             throw error
//         }
//     }
// }

// ----- e-paper: delete function -----
const deleteEpaper = async () => {
  let //
    classArray = document
      .querySelector(".wrapper-1")
      .getAttribute("class")
      .split(" "),
    subscribeAlready = classArray.includes("wrapper-hidden");

  if (subscribeAlready) {
    let discordEndpoint = document.querySelector(
      ".wrapper-2 .user-input"
    ).value;
    try {
      let response = await fetch("/api/e_paper", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: discordEndpoint,
        }),
      });

      let result = await response.json();

      if (!response.ok) {
        throw "Delete failed.";
      }

      alert("See you!");

      return "Delete succeeds.";
    } catch (error) {
      throw error;
    }
  }
};

// ----- add click event for Epaper-----
let //
  subscribeBtn1 = document.querySelectorAll(".subscribe-btn p")[0],
  subscribeBtn2 = document.querySelectorAll(".subscribe-btn p")[1],
  deleteBtn = document.querySelector(".unsubscribe-btn p");

subscribeBtn1.addEventListener("click", updateEpaper);
subscribeBtn2.addEventListener("click", updateEpaper);
deleteBtn.addEventListener("click", deleteEpaper);
