from flask import Flask, render_template

from weather import weather_bp
from e_paper import e_paper
from db_connection import DB_Connector

app = Flask(__name__)
app.register_blueprint(weather_bp)
app.register_blueprint(e_paper)

app.json.ensure_ascii = False
app.json.sort_keys = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["cnx_pool"] = DB_Connector()


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=3000)
