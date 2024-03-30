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


### Backend

Located in the `backend/` directory, the Django server provides REST API functionality. It is structured to serve data to the frontend and handle all backend logic, including database interactions, authentication, and business logic.

### Frontend

Located in the `fronend/` directory, the frontend is a React application that consumes the REST API provided by the Django backend.

Each part of the application has it's own README file with more detailed information.


### Database - Secure due to password protection
 ```bash
 psql -h csce-315-db.engr.tamu.edu -U csce315_902_02_user -d csce315_902_02_db
 ```