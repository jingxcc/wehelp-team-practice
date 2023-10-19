import datetime
import os

import requests
from dotenv import load_dotenv

from app import app
from e_paper import send_weather_comment, convert_string_to_lst
from flask_apscheduler import APScheduler

scheduler = APScheduler()

# views
def convert_lst_to_string(lst):
    string = ','.join(lst)
    return string

def parse_weather_description(data):
    weather_comment = []
    for i in range(len(data['cwaopendata']['dataset']['parameterSet']['parameter'])):
        weather_comment.append(data['cwaopendata']['dataset']['parameterSet']['parameter'][i]['parameterValue'])
    return weather_comment

# models
def get_subscriber_webhook_url(city):
    try:
        cnx_pool = app.config['cnx_pool']
        conn, cursor = cnx_pool.get_connection_and_cursor()
    except:
        cnx_pool.release_connection_and_cursor(conn, cursor)
        return {'error': True, 'message': 'cannot connect to database'}, 500
    cursor.execute('SELECT webhook_url FROM subscriber WHERE city=%s', (city,))
    record = cursor.fetchall()
    cnx_pool.release_connection_and_cursor(conn, cursor)
    return record

def get_weather_comment_from_db(city):
    try:
        cnx_pool = app.config['cnx_pool']
        conn, cursor = cnx_pool.get_connection_and_cursor()
    except:
        cnx_pool.release_connection_and_cursor(conn, cursor)
        return {'error': True, 'message': 'cannot connect to database'}, 500
    cursor.execute('SELECT comment FROM weather_comment WHERE city=%s', (city,))
    record = cursor.fetchone()
    cnx_pool.release_connection_and_cursor(conn, cursor)
    return record

def save_weather_comment(city, weather_comment, current_time):
    try:
        cnx_pool = app.config['cnx_pool']
        conn, cursor = cnx_pool.get_connection_and_cursor()
    except:
        cnx_pool.release_connection_and_cursor(conn, cursor)
        return {'error': True, 'message': 'cannot connect to database'}, 500
    cursor.execute('INSERT INTO weather_comment(city, comment, update_time) VALUES(%s, %s, %s) ON DUPLICATE KEY UPDATE comment = VALUES(comment), update_time = VALUES(update_time)', (city, weather_comment, current_time))
    conn.commit()
    cnx_pool.release_connection_and_cursor(conn, cursor)

def get_weather_info(city):
    load_dotenv()
    weather_api_key = os.getenv('weather_api_key')
    api_url_dic = {
        '台北': 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0032-009',
        '新北': 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0032-010',
        '桃園': 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0032-022',
        '台中': 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0032-021',
        '台南': 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0032-016',
        '高雄': 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-C0032-017'
    }
    url = api_url_dic[city]
    params = {
    "Authorization": weather_api_key,
    "downloadType": "WEB",
    "format": "JSON"
    }
    response = requests.get(url, params=params, timeout = 30)
    data = response.json()
    return data

# controllers
@scheduler.task('cron', id = 'job1', day = '*', hour = '08', minute = '00', second = '00', misfire_grace_time = 60, timezone='asia/taipei')
def send_e_paper_at_8am():
    city_lst = ['台北', '新北', '桃園', '台中', '台南', '高雄']
    for city in city_lst:
        webhook_urls = get_subscriber_webhook_url(city)
        if webhook_urls == None:
            pass
        else:
            weather_comment = get_weather_comment_from_db(city)
            weather_comment = convert_string_to_lst(weather_comment[0])
            for i in range(len(webhook_urls)):
                send_weather_comment(weather_comment, webhook_urls[i][0])
    print(str(datetime.datetime.now()) + 'Complete the daily e-paper delivery')

@scheduler.task('cron', id = 'job2', day = '*', hour = '07', minute = '00', second = '00', misfire_grace_time = 60, timezone='asia/taipei')
def update_weather_info_at_7am():
    city_lst = ['台北', '新北', '桃園', '台中', '台南', '高雄']
    for city in city_lst:
        weather_info = get_weather_info(city)
        weather_comment = parse_weather_description(weather_info)
        weather_comment = convert_lst_to_string(weather_comment)
        save_weather_comment(city, weather_comment, str(datetime.datetime.now()))
    print(str(datetime.datetime.now()) + 'weather_comment database update')

@scheduler.task('cron', id = 'job3', day = '*', hour = '19', minute = '00', second = '00', misfire_grace_time = 60, timezone='asia/taipei')
def update_weather_info_at_7pm():
    city_lst = ['台北', '新北', '桃園', '台中', '台南', '高雄']
    for city in city_lst:
        weather_info = get_weather_info(city)
        weather_comment = parse_weather_description(weather_info)
        weather_comment = convert_lst_to_string(weather_comment)
        save_weather_comment(city, weather_comment, str(datetime.datetime.now()))
    print(str(datetime.datetime.now()) + 'weather_comment database update')