from datetime import date
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, render_template, json

app = Flask(__name__)
app.secret_key = b'\x0c\x8f~O\x9c\x16\xd5\xbf\x9c\xa2\xbekE\x9c\xec\x93\x8b\xfeWF\xe6\x0e?\xfc'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/hakuchan/Desktop/Pomodoro/extension/test.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# A Day represents all the activities worked on during a specific date

class Day(db.Model):
    __tablename__ = 'days'
    # if you don't set the name, the name of the field becomes the name of the column
    id = db.Column(db.Integer, primary_key=True)
    activities = db.relationship('Activity', backref='day', lazy='dynamic')


def __init__(self, date):
    self.id = date
# An Activity entry represents an acitvity worked on and the length of time spent working on it 


class Activity(db.Model):
    __tablename__ = 'activity'
    id = db.Column(db.String(120), primary_key=True)
    name = db.Column(db.String(120))
    time = db.Column(db.Float, nullable=False)
    date_id = db.Column(db.Integer, db.ForeignKey('days.id'))


def __init__(self, name, time):
    self.name = name
    self.time = time


def __repr__(self):
    return f"{self.name} :{self.time} hours"


# On a post request, the database will update an existing activity or create a new entry


@ app.route("/stats", methods=["GET", "POST"])
def stats_home():
    if request.method == 'POST':
        activity = request.form.get('activity')
        # session["activity"] = activity
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

# current_date represents the date when the timer was used as MM/DD/YYYY
# Example: 11122021 is the date November 12, 2021. 
# Creates a new date entry if current_date does not already exist in the table
# Otherwise goes to the table linked to current_date and updates the day's activities
@ app.route("/stats/<int:current_date>", methods=["GET", "POST"])
def stats_date(current_date):
    if request.method == 'POST':
        activity = request.form.get('activity')
        day = Day.query.filter_by(id=current_date).first()
        if day:
            current_activity = day.activities.filter_by(name=activity).first()
            if current_activity:
                current_activity.time = current_activity.time + 1
                db.session.commit()
            else:
                current_activity = Activity(
                    id=activity+str(current_date), name=activity, time=0)
                day.activities.append(current_activity)
                db.session.add(current_activity)
                db.session.commit()
        else:
            day = Day(id=current_date)
            current_activity = Activity(
                id=activity+str(current_date), name=activity, time=0)
            day.activities.append(current_activity)
            db.session.add(day)
            db.session.add(current_activity)
            db.session.commit()
    # render the stats.html page when you get to http://127.0.0.1:5000/stats
    return render_template("stats.html")

# create a json serializable representation of the table. A day has a date id in the 
# form of MM/DD/YYYY and a list of activities. An activity records the name of the 
# activity and time spent working on it
@ app.route("/data")
def get_data():
    data = Day.query.order_by(Day.id).all()
    output = []
    for date in data:
        date_activities = []
        for activity in date.activities:
            c_activity = {'id': activity.id,
                          'name': activity.name, 'time': activity.time}
            date_activities.append(c_activity)
        day = {'id': date.id, 'activities': date_activities}
        output.append(day)
    return {"data": output}

# makes a date string from an integer in the form of MMDDYYYY
def date_conversion(date):
    date_str = str(date)
    return date_str[0:2]+"/"+date_str[2:4]+"/"+date_str[4:]

# Outputs a graph of the activities from a certain day
@ app.route("/data/<int:current_date>")
def get_data_date(current_date):
    data = Day.query.filter_by(id=current_date).first()
    labels=[]
    data_values=[]
    for activity in data.activities:
        labels.append(activity.name)
        data_values.append(activity.time)
    labels_json=json.dumps(labels)
    data_values_json=json.dumps(data_values)
    return render_template('data.j2', date=date_conversion(current_date),labels=labels_json, data=data_values_json)


@ app.before_first_request
def create_tables():
    # reset the database when you make a schema change
    # db.drop_all()
    db.create_all()
