from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, render_template, session

app = Flask(__name__)
app.secret_key = b'\x0c\x8f~O\x9c\x16\xd5\xbf\x9c\xa2\xbekE\x9c\xec\x93\x8b\xfeWF\xe6\x0e?\xfc'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# TODO create a one-to-many relationship to keep track of time across days
# class Day(db.Model):
#     date = db.Column(db.Integer, primary_key=True)
#     activities = db.relationship('Activity', backref='Day', lazy=True)

# define a model class. Entries have a name and a time field


class Activity(db.Model):
    name = db.Column(db.String(120), primary_key=True)
    time = db.Column(db.Integer, nullable=False)


def __init__(self, name, time):
    self.name = name
    self.time = time


def __repr__(self):
    return f"{self.name} :{self.time} hours"


# On a post request, the database will update an existing activity or create a new entry


@app.route("/stats", methods=["GET", "POST"])
def stats_home():
    if request.method == 'POST':
        activity = request.form.get('activity')
        session["activity"] = activity
        current_activity = Activity.query.filter_by(name=activity).first()

        if current_activity:
            current_activity.time = current_activity.time + 1
            db.session.commit()
        else:
            c_activity = Activity(name=activity, time=0)
            db.session.add(c_activity)
            db.session.commit()
    # render the stats.html page when you get to http://127.0.0.1:5000/stats
    return render_template("stats.html")


@app.route("/stats/<int:date>")
def stats_date(date):
    return {
        "date": date,
    }


@app.route("/data")
def get_data():
    data = Activity.query.all()
    output = []
    for activity in data:
        c_activity = {'name': activity.name, 'time': activity.time}
        output.append(c_activity)
    return {"data": output}


@app.before_first_request
def create_tables():
    db.create_all()
