# Full-Stack Django & React POS System

## Overview

This project consists of a full-stack web application with a Django REST API backend and a React frontend.

### Navigation
Navigation between pages is hidden and protected to prevent a customer from viewing other pages. To switch between pages, click on the top left of the screen an select which page you want to go to. You will need authorization, use USERNAME: gemma and PASSWORD: password to navigate pages. 

### Scrum Meeting Times: Sprint 1
#### Meeting 1
Date: 3/26/2024 12:10-12:25pm
    Discussed setup of project and how work was going to be distributed. While everyone will be involved in the project, Karlos and Jin are focusing in on the backed, and Gemma, Allen, and Yohan will be mostly working on the front end. The setup of the Django server has been started so that the front end can begin work. The group is also looking for a component library to add to project to help ease styling. 

#### Meeting 2
Date: 3/27/2024 4:00-4:25pm
    Django server has been set up, and Karlos worked on authorization for limiting who has access to specific pages. Jou MUI has also been selected as a component library. Gemma, Allen, and Yohan divided up pages to start implementing to be able to have a MVP by friday. Jin will be working on backend work for processing orders and updating the database.
    
#### Meeting 3
Date: 3/28/2024 12:10-12:25pm
    Front end work has made progress with menu cards that nicely display the menu items on the customer page. Front end work continues as Gemma started to work on the menu billboard and plans to add rotating images to display the menu items. Jin continues to work on back end processing, and Yohan and Allen work to adding items to the cart when pressing the plus icon. Next steps involve populating the order summary page to reflect the cart and more styling.  

### Scrum Meeting Times: Sprint 2
#### Meeting 4 
Prepared by: Karlos Zurutuza
Meeting Date: 4/9/2024 12:10-12:25pm
Meeting Attendees:
Jin Seok Oh
Karlos Zurutuza
Yohan Cho
Gemma Goddard
Allen Wang
Meeting Agenda Items
Describe what we have done in the previous Sprint, and what should be done.
Assigned tasks for Sprint 2
Prepared necessary dependencies/libraries needed
Status Update Since Last Meeting
Accomplishments:
Break; starting the second Sprint 
Selected a graphing library
Set up backend connection for data

#### Meeting 5
Prepared by: Karlos Zurutuza
Meeting Date: 4/10/2024 4:00-4:25pm
Meeting Attendees:
Jin Seok Oh
Karlos Zurutuza
Yohan Cho
Gemma Goddard
Allen Wang

Meeting Agenda Items
Check individual progress of sprint 2, and address any challenges
Make sure that everyone understands what they are supposed to be working on, and are making progress
Status Update Since Last Meeting
Accomplishments:
Everyone has some specific tasks to begin working on for this sprint
Some adjustments have been made to the navigation drawer and customer view to make text more visible and accessible
Jin has been working on sending the information needed for the graphs to the front end to populate the manager graph view page

#### Meeting 6
Prepared by: Karlos Zurutuza
Meeting Date: 4/11/2024 12:10-12:25pm
Meeting Attendees:
Jin Seok Oh
Karlos Zurutuza
Yohan Cho
Gemma Goddard
Allen Wang
Meeting Agenda Items
Check individual progress of sprint 2, and address any challenges
Make sure that everyone understands what they are supposed to be working on, and are making progress
Status Update Since Last Meeting
Accomplishments:
Progress has been made to the manager graph page, and a few graphs have been populated
Weather API has been started, and working on displaying the information on the system

### Scrum Meeting Times: Sprint 3
#### Meeting 7
Prepared by: Karlos Zurutuza
Meeting Date: 4/23/2024 12:10-12:25pm
Meeting Attendees:
Jin Seok Oh
Karlos Zurutuza
Yohan Cho
Gemma Goddard
Allen Wang
Meeting Agenda Items
Describe what we have done in the previous Sprint, and what should be done.
Assigned tasks for Sprint 3
Consider any stretch goals and look for missing dependencies
Status Update Since Last Meeting
Accomplishments:
Break; starting the Third Sprint 
Add more API functionality and customization
Prepare backend for menu and inventory editing

#### Meeting 8
Prepared by: Karlos Zurutuza
Meeting Date: 4/24/2024 4:00-4:25pm
Meeting Attendees:
Jin Seok Oh
Karlos Zurutuza
Yohan Cho
Gemma Goddard
Allen Wang
Meeting Agenda Items
Check individual progress of sprint 3, and address any challenges
Make sure that everyone understands what they are supposed to be working on, and are making progress
Ensure that we have implemented everything needed for our final product 
Status Update Since Last Meeting
Accomplishments:
Everyone has some specific tasks to begin working on for this sprint
We started looking into/ implementing our special feature of a kitchen view page and text message confirmation of an order 
Jin has been working on sending the information for orders in progress to the front end so that the kitchen view page can be populated

#### Meeting 9
Prepared by: Karlos Zurutuza
Meeting Date: 4/25/2024 12:10-12:25pm
Meeting Attendees:
Jin Seok Oh
Karlos Zurutuza
Yohan Cho
Gemma Goddard
Allen Wang
Meeting Agenda Items
Check individual progress of sprint 3, and address any challenges
Make sure that everyone understands what they are supposed to be working on, and are making progress
Status Update Since Last Meeting
Accomplishments:
 Orders are now set to in progress when placed and the front end is able to access all orders that are in progress
Texting API has been started, but waiting for confirmation to be approved 


### Backend

Located in the `backend/` directory, the Django server provides REST API functionality. It is structured to serve data to the frontend and handle all backend logic, including database interactions, authentication, and business logic.

### Frontend

Located in the `fronend/` directory, the frontend is a React application that consumes the REST API provided by the Django backend.

Each part of the application has it's own README file with more detailed information.


### Database - Secure due to password protection
 ```bash
 psql -h csce-315-db.engr.tamu.edu -U csce315_902_02_user -d csce315_902_02_db
 ```
