from flask import Flask, request

app = Flask(__name__)


@app.route("/stats")
def stats_home():
    return "<p>stats</p>"


@app.route("/stats/<int:date>")
def stats_date(date):
    return f'Post: {date}'
