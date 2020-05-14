# Supermarket scheduler app

This application allows persons to create appointments when visiting a supermarket, making them less crowded.

There are 2 components of this application:
 - backend
 - frontend
 
### Running the backend app
 
 To run the backend application, first you need to create the database. For this, please follow instructions from `create_db_instructions.txt` and `create_db.sql` files. 
 
 Then, in `backend` folder, run the following commands:
  - `mvn clean install`
  - `java -jar target/supermarketscheduler-0.0.1-SNAPSHOT.jar`
  
### Running the frontend app

To run the frontend app, just run `npm start` in the `frontend` folder.