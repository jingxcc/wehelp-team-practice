from app import app
from e_paper import get_weather_info, parse_weather_description, send_weather_info
from flask_apscheduler import APScheduler

scheduler = APScheduler()

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

# controllers
@scheduler.task('cron', id = 'job1', day = '*', hour = '08', minute = '00', second = '00', misfire_grace_time = 60, timezone='asia/taipei')
def job1():
    city_lst = ['台北', '新北', '桃園', '台中', '台南', '高雄']
    for city in city_lst:
        webhook_urls = get_subscriber_webhook_url(city)
        if webhook_urls == None:
            pass
        else:
            weather_info = get_weather_info(city)
            weather_comment = parse_weather_description(weather_info)
            for i in range(len(webhook_urls)):
                send_weather_info(weather_comment, webhook_urls[i][0])