import os
import datetime

import mysql.connector
from dotenv import load_dotenv

from daily_e_paper_schedule import get_weather_info, parse_weather_description, convert_lst_to_string

def connect_to_db():
    load_dotenv()
    conn = mysql.connector.connect(
        host = 'localhost',
        database = 'weather_assistant',
        user = os.getenv('db_user'),
        password = os.getenv('db_password')
    )
    cursor = conn.cursor()
    return conn, cursor

def save_weather_comment(city, weather_comment, current_time):
    try:
        conn, cursor = connect_to_db()
    except:
        print('Unable to connect to the database.')
    cursor.execute('INSERT INTO weather_comment(city, comment, update_time) VALUES(%s, %s, %s) ON DUPLICATE KEY UPDATE comment = VALUES(comment), update_time = VALUES(update_time)', (city, weather_comment, current_time))
    conn.commit()
    cursor.close()
    conn.close()

city_lst = ['台北', '新北', '桃園', '台中', '台南', '高雄']
for city in city_lst:
    weather_info = get_weather_info(city)
    weather_comment = parse_weather_description(weather_info)
    weather_comment = convert_lst_to_string(weather_comment)
    save_weather_comment(city, weather_comment, str(datetime.datetime.now()))
print(str(datetime.datetime.now()) + 'weather_comment database update')