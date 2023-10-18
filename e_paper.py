import re

from flask import Blueprint, jsonify, request, current_app
import requests

e_paper = Blueprint('e_paper', __name__)

# views
def check_input(city, webhook_url):
    city_lst = ['台北', '新北', '桃園', '台中', '台南', '高雄']
    url_pattern = r'^https://discord\.com/api/webhooks/'
    is_city_correct = city in city_lst
    is_url_correct = bool(re.match(url_pattern, webhook_url))
    if is_city_correct and is_url_correct:
        return True
    else:
        return False

def parse_weather_description(data):
    weather_comment = []
    for i in range(len(data['cwaopendata']['dataset']['parameterSet']['parameter'])):
        weather_comment.append(data['cwaopendata']['dataset']['parameterSet']['parameter'][i]['parameterValue'])
    return weather_comment

# models
def add_subscriber(city, webhook_url):
    try:
        cnx_pool = current_app.config['cnx_pool']
        conn, cursor = cnx_pool.get_connection_and_cursor()
    except:
        return {'error': True, 'message': 'cannot connect to database'}, 500
    try:
        cursor.execute('INSERT INTO subscriber(city, webhook_url) VALUES(%s, %s)', (city, webhook_url))
        conn.commit()
        cnx_pool.release_connection_and_cursor(conn, cursor)
        return {'ok': True}, 200
    except:
        cnx_pool.release_connection_and_cursor(conn, cursor)
        return {'error': True, 'message': 'this webhook url has already been subscribed'}, 400
    
def update_subscribe_city(city, webhook_url):
    try:
        cnx_pool = current_app.config['cnx_pool']
        conn, cursor = cnx_pool.get_connection_and_cursor()
    except:
        return {'error': True, 'message': 'cannot connect to database'}, 500
    cursor.execute('SELECT * FROM subscriber WHERE webhook_url=%s', (webhook_url,))
    record = cursor.fetchone()
    if record == None:
        return {'error': True, 'message': 'this url has not subscribed to e-paper'}, 400
    cursor.execute('UPDATE subscriber SET city=%s WHERE webhook_url=%s', (city, webhook_url))
    conn.commit()
    cnx_pool.release_connection_and_cursor(conn, cursor)
    return {'ok': True}, 200

def del_subscriber(webhook_url):
    try:
        cnx_pool = current_app.config['cnx_pool']
        conn, cursor = cnx_pool.get_connection_and_cursor()
    except:
        return {'error': True, 'message': 'cannot connect to database'}, 500
    cursor.execute('DELETE FROM subscriber WHERE webhook_url=%s', (webhook_url,))
    conn.commit()
    cnx_pool.release_connection_and_cursor(conn, cursor)
    return {'ok': True}, 200
    
def send_e_paper_subscription_notification(city, webhook_url, state):
    state_content_map = {
        'add': f'哈囉~ 感謝您訂閱天氣小幫手，在每天早上8推播:four_leaf_clover:{city}:four_leaf_clover:的天氣資訊給您。\n以下是今天的天氣資訊，那我們明天見囉:sparkles:',
        'update': f'訂閱的城市更新囉！之後每天早上8推播:four_leaf_clover:{city}:four_leaf_clover:的天氣資訊給您。\n以下是今天的天氣資訊，那我們明天見囉:sparkles:',
        'delete': f'已取消訂閱天氣小幫手，期待下次與您相見:sparkles:'
    }
    request_body = {
    'username': '天氣小幫手\U0001F436',
    'content': state_content_map[state]
    }
    r = requests.post(webhook_url, json = request_body)
  
def get_weather_info(city):
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
    "Authorization": "CWA-28A64111-004B-4509-A905-C344C33D34C3",
    "downloadType": "WEB",
    "format": "JSON"
    }
    response = requests.get(url, params=params)
    data = response.json()
    return data

def send_weather_info(weather_comment, webhook_url):
    brief_comment = {
    'username': '天氣小幫手\U0001F436',
    'embeds': [{'title': weather_comment[0], 'color': '14177041'}],
    }
    r = requests.post(webhook_url, json = brief_comment)
    for i in range(1, len(weather_comment)):
        weather_detail = {
            'username': '天氣小幫手\U0001F436',
            'content': weather_comment[i]
        }
        r = requests.post(webhook_url, json = weather_detail)

# controllers
@e_paper.route('/api/e_paper', methods = ['POST', 'PATCH'])
def subscribe_e_paper():
    data = request.get_json()
    city = data.get('city')
    webhook_url = data.get('webhookUrl')

    is_input_correct = check_input(city, webhook_url)
    if is_input_correct == False:
        return jsonify({'error': True, 'message': 'invalid city or webhook url'}), 400
    
    if request.method == 'POST':
        response, status_code = add_subscriber(city, webhook_url)
        if status_code != 200:
            return jsonify(response), status_code
        weather_info = get_weather_info(city)
        weather_comment = parse_weather_description(weather_info)
        send_e_paper_subscription_notification(city, webhook_url, 'add')
        send_weather_info(weather_comment, webhook_url)
        return jsonify(response), status_code

    elif request.method == 'PATCH':
        response, status_code = update_subscribe_city(city, webhook_url)
        if status_code != 200:
            return jsonify(response), status_code
        weather_info = get_weather_info(city)
        weather_comment = parse_weather_description(weather_info)
        send_e_paper_subscription_notification(city, webhook_url, 'update')
        send_weather_info(weather_comment, webhook_url)
        return jsonify(response), status_code

@e_paper.route('/api/e_paper', methods = ['DELETE'])
def del_subscribe_info():
    data = request.get_json()
    webhook_url = data.get('webhookUrl')
    response, status_code = del_subscriber(webhook_url)
    send_e_paper_subscription_notification(None, webhook_url, 'delete')
    return response, status_code
