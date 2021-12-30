# I believe this only works on linux. I made a separate batch script for windows. 
flask:
	FLASK_APP=main.py FLASK_ENV=development flask run

clean: 
	rm -rf __pycache__