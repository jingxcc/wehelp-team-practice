let userSelectValue;
const opts=document.querySelectorAll(".opt")

function selectOpt(){
  const opts=document.querySelectorAll(".opt")
  opts.forEach((opt)=>{
    opt.addEventListener('click',()=>{
      userSelectValue=opt.innerHTML
      document.querySelector('.city').innerHTML=userSelectValue
    })
  })
}
selectOpt();

const weatherData = {
  "台北市": {
    rainPercentage: '70',
    weatherText: '陰天',
    comfort: '涼爽',
    maxTemp: 28,
    minTemp: 26,
    tempDegree:28
  },
  "新北市": {
    rainPercentage: '20',
    weatherText: '雨天',
    comfort: '舒適',
    maxTemp: 30,
    minTemp: 28,
    tempDegree:28
  },
  "桃園市": {
    rainPercentage: '100',
    weatherText: '雨天',
    comfort: '濕冷',
    maxTemp: 25,
    minTemp: 24,
    tempDegree:23
  },
  "台中市": {
    rainPercentage: '100',
    weatherText: '雨天',
    comfort: '濕冷',
    maxTemp: 33,
    minTemp: 26,
    tempDegree:24
  },
  "台南市": {
    rainPercentage: '10',
    weatherText: '晴天',
    comfort: '乾爽',
    maxTemp: 23,
    minTemp: 21,
    tempDegree:24
  },
  "高雄市": {
    rainPercentage: '0',
    weatherText: '多雲',
    comfort: '濕冷',
    maxTemp: 22,
    minTemp: 33,
    tempDegree:23
  },
}

const rainPercentageData=document.querySelector(".rainpercentage")
const weathertextData=document.querySelector(".weathertext")
const comfortData=document.querySelector(".comfort")
const maxTempData=document.querySelector(".max_temperature")
const minTempData=document.querySelector(".min_temperature")
const tempDegree=document.querySelector(".temperature_degree")

opts.forEach((opt) => {
  opt.addEventListener('click', () => {
    const userSelectValue = opt.innerHTML;
    if (weatherData.hasOwnProperty(userSelectValue)) {
      const data = weatherData[userSelectValue];
      rainPercentageData.innerHTML = data.rainPercentage;
      weathertextData.innerHTML = data.weatherText;
      comfortData.innerHTML = data.comfort;
      maxTempData.textContent = data.maxTemp;
      minTempData.textContent = data.minTemp;
      tempDegree.textContent = data.tempDegree;
    }
  });
});