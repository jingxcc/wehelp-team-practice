import datetime

from flask import Flask, render_template
from flask_apscheduler import APScheduler

from routes.weahter import weather_bp
from subscribe_newsletter import newsletter
from subscribe_newsletter import get_weather_info, parse_weather_description, send_weather_info
from db_connection import DB_Connector

app = Flask(__name__)
app.register_blueprint(weather_bp)
app.register_blueprint(newsletter)

app.json.ensure_ascii = False
app.json.sort_keys = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['cnx_pool'] = DB_Connector()
app.config['SCHEDULER_API_ENABLED'] = True
app.config['SCHEDULER_TIMEZONE'] = 'asia/taipei'

scheduler = APScheduler()

@app.route("/")
def index():
    return render_template("index.html")

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

@scheduler.task('cron', id = 'job1', day = '*', hour = '08', minute = '00', second = '00', misfire_grace_time = 60, timezone='asia/taipei')
def job1():
    print(str(datetime.datetime.now()) + ' Job 1 executed')
    city_lst = ['台北', '新北', '桃園', '台中', '台南', '高雄']
    for city in city_lst:
        webhook_urls = get_subscriber_webhook_url(city)
        print(webhook_urls)
        if webhook_urls == None:
            pass
        else:
            weather_info = get_weather_info(city)
            weather_comment = parse_weather_description(weather_info)
            for i in range(len(webhook_urls)):
                send_weather_info(weather_comment, webhook_urls[i][0])

if __name__ == "__main__":
    scheduler.init_app(app)
    scheduler.start()
    app.debug = True
    app.run(host="0.0.0.0", port=3000)
