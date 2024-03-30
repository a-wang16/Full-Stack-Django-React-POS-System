# Full-Stack Django & React POS System

## Overview

This project consists of a full-stack web application with a Django REST API backend and a React frontend.

### Navigation
Navigation between pages is hidden and protected to prevent a customer from viewing other pages. To switch between pages, click on the top left of the screen an select which page you want to go to. You will need authorization, use USERNAME: gemma and PASSWORD: password to navigate pages. 

### Scrum Meeting Times
#### Meeting 1
Date: 2/26/2024 12:10-12:25pm
#### Meeting 2
Date: 2/27/2024 8:00-8:20pm
#### Meeting 
Date: 2/28/2024 12:10-12:25pm


### Backend

Located in the `backend/` directory, the Django server provides REST API functionality. It is structured to serve data to the frontend and handle all backend logic, including database interactions, authentication, and business logic.

### Frontend

Located in the `fronend/` directory, the frontend is a React application that consumes the REST API provided by the Django backend.

Each part of the application has it's own README file with more detailed information.


### Database - Secure due to password protection
 ```bash
 psql -h csce-315-db.engr.tamu.edu -U csce315_902_02_user -d csce315_902_02_db
 ```