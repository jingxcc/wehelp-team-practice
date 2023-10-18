from flask import Flask, render_template

from routes.weahter import weather_bp
from subscribe_newsletter import newsletter
from db_connection import DB_Connector

app = Flask(__name__)
app.register_blueprint(weather_bp)
app.register_blueprint(newsletter)

app.json.ensure_ascii = False
app.json.sort_keys = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config['cnx_pool'] = DB_Connector()


@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=3000)
