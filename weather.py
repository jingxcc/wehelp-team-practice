from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import requests, os, json
from datetime import datetime, timedelta

weather_bp = Blueprint("weather_bp", __name__)

load_dotenv()
weather_api_key = os.getenv("weather_api_key")
TIME_INTERVAL = 18
LOCATION_LIST_API = [
    "宜蘭縣",
    "花蓮縣",
    "臺東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
    "臺北市",
    "新北市",
    "桃園市",
    "臺中市",
    "臺南市",
    "高雄市",
    "基隆市",
    "新竹縣",
    "新竹市",
    "苗栗縣",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "嘉義市",
    "屏東縣",
]
LOCATION_NAME_MAPPING_API = {"台": "臺"}


@weather_bp.route("/api/weathers")
def get_weather():
    location_name = request.args.get("locationName")
    if location_name is None or location_name == "":
        message = "Please pass required parameters, or other reasons"
        return jsonify({"error": True, "message": message}), 400

    location_name_api = location_name
    for char in LOCATION_NAME_MAPPING_API:
        if char in location_name_api:
            location_name_api = location_name_api.replace(
                char, LOCATION_NAME_MAPPING_API[char]
            )
    if location_name_api not in LOCATION_LIST_API:
        message = "Please pass valiate location"
        return jsonify({"error": True, "message": message}), 400

    result_weather_status, status_code = get_weather_status(location_name_api)
    if "error" in result_weather_status:
        return jsonify(result_weather_status), status_code

    result_current_temp, status_code = get_current_temp(location_name_api)
    if "error" in result_current_temp:
        return jsonify(result_current_temp), status_code

    response_data = {"success": True, "data": []}
    response_data["data"].append({"location": location_name, "weatherElement": []})
    weather_status = result_weather_status["records"]["location"]
    current_temperature = result_current_temp["records"]["locations"][0]["location"]

    if (
        len(weather_status[0]["weatherElement"][0]["time"]) == 0
        or len(current_temperature[0]["weatherElement"][0]["time"]) == 0
    ):
        return jsonify({"success": True, "data": None})

    elements_with_unit = ["PoP", "MinT", "MaxT", "T"]
    elements_with_valueId = ["Wx"]
    units_metrics = {"百分比": "%", "攝氏度": "C"}
    for status in weather_status[0]["weatherElement"]:
        status_list = {
            "code": status["elementName"],
            "value": status["time"][0]["parameter"]["parameterName"],
        }

        if status["elementName"] in elements_with_unit:
            status_list["unit"] = status["time"][0]["parameter"]["parameterUnit"]

            if status_list["unit"] in units_metrics:
                status_list["unit"] = units_metrics[status_list["unit"]]

        if status["elementName"] in elements_with_valueId:
            status_list["valueId"] = status["time"][0]["parameter"]["parameterValue"]

        response_data["data"][0]["weatherElement"].append(status_list)

    for status in current_temperature[0]["weatherElement"]:
        status_list = {
            "code": status["elementName"],
            "value": status["time"][0]["elementValue"][0]["value"],
        }

        if status["elementName"] in elements_with_unit:
            status_list["unit"] = status["time"][0]["elementValue"][0]["measures"]
            if status_list["unit"] in units_metrics:
                status_list["unit"] = units_metrics[status_list["unit"]]

        response_data["data"][0]["weatherElement"].append(status_list)

    return jsonify(response_data)


def get_weather_status(location_name):
    try:
        api_url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001"
        payload = {
            "Authorization": weather_api_key,
            "locationName": location_name,
            "timeTo": (datetime.now() + timedelta(hours=TIME_INTERVAL)).strftime(
                "%Y-%m-%dT%H:00:00"
            ),
        }
        response = requests.get(api_url, params=payload)
        status_code = response.status_code
        if status_code == 200:
            response = response.json()
            return response, status_code
        else:
            message = f"Open Weather API: {response.reason}"
            return {"error": True, "message": message}, status_code

    except Exception as error:
        print(f"Open Weather API: {error}")
        message = "Open Weather API Error"
        return {"error": True, "message": message}, 500


def get_current_temp(location_name):
    try:
        api_url = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-089"
        payload = {
            "Authorization": weather_api_key,
            "locationName": location_name,
            "timeTo": (datetime.now() + timedelta(hours=TIME_INTERVAL)).strftime(
                "%Y-%m-%dT%H:00:00"
            ),
            "elementName": "T",
        }
        response = requests.get(api_url, params=payload)
        status_code = response.status_code
        if status_code == 200:
            response = response.json()
            return response, status_code
        else:
            message = f"Open Weather API: {response.reason}"
            return {"error": True, "message": message}, status_code

    except Exception as error:
        print(f"Open Weather API: {error}")
        message = "Open Weather API Error"
        return {"error": True, "message": message}, 500
