## <a href="https://birdnest-3wmh.onrender.com/">PROJECT BIRDNEST | NDZ Perimeter Violation Tracker</a> ##

***A pre-assignment for the summer 2023 Developer Trainee position at Reaktor, Helsinki.***  
  
This is a web application built with <strong>TypeScript</strong>, <strong>Node.js</strong>, <strong>Express</strong>, <strong>Postgres</strong> and <strong>React</strong> that displays a list of pilots who have recently violated the NDZ (No-Drone Zone) perimeter.  
  
## Functionality  

The app displays all pilots who have violated the NDZ perimeter in the last 10 minutes.   
  
Displays information about violating pilots including name, email, phone number, and the closest distance that was tracked for each violating pilot.  
  
The most severe violation that was made by the violator out of this list is also displayed at the top of the page.  
  
The information is immediately shown to anyone opening the application and does not require the user to manually refresh the view to see up-to-date information.  
  
Information is being updated every two seconds and being stored for the duration of 10 minutes after violating drone was last-seen by the tracking equipment.  
  
## Stack
- Typescript
- Node.js 
- Express
- React
- PostgreSQL
- Material-UI
- Jest
  
## Implementation steps  
1. Initialize and prepare backend environment (test and dev env, error handler, lint, prettier etc)  
2. Get and parse the report:  
  - Get XML data by making axios GET request to the reaktor API
	- Convert data into JS object with <i>xml-js</i> package  
  - Type elements and parse converted payload, then return
3. Process drone report:  
  - Find drones that are violating the NDZ perimeter by calculating the distance between the drone and the nest.
  - To eliminate the amount of API requests to the pilots endpoint, check if a pilot with a given unique serial number was already seen and has been already tracked. 
	- If the pilot is violating the NDZ for the first time OR if they were already tracked, but their data failed to retrieve before, send a GET request using the drone's serial number and save the pilot's information.
  - Update latest positions, and last seen times of existing pilots.
	- Update the closest distance for those who flew closer to the Monadikuikka nest than before.
	- Clean violator entries that were last detected by the equipment more than 10 minutes ago.
	<i>Three previous steps (2, 3, 4) are running in the background with 2sec interval. Errors should be caught and displayed to the console.</i>  
4. Return violating pilots information and entries that are not older than 10 minutes with the successful status code to the client.
5. Complete front: 
	- Initialize React app
	- On a two sec interval request violators from the backend, display as a list of cards on the page.
	- Add styles using MUI and custom styled components. 
	- Create a "radar" looking svg to display current position of each violator (whether he is inside the NDZ or already flew out of it). 
	- Calculate the closest to the nest distance of all the pilots (<i>for past 10 min, not of all times, as I wasn't quite sure what objective was asking for</i>)  display on top. 
	- Adjust responsiveness. 
6. Deploy on <a href="https://render.com/">Render</a>

### Note
<i>This project was done as a part of the programming assignment, the functionality of the application is limited to the given <a href="https://assignments.reaktor.com/birdnest/">requirements</a> of the assignment.</i>  

My workflow and notes may be found <a href="https://trello.com/b/yIzF2qnH/birdnest">here</a>  
