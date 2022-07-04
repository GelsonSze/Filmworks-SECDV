# CCAPDEV PHASE 2 AND 3 Submission and Details
## Group
Members:
* Ng, Sherilyn Kaye
* Vizmanos, Julianne Andrea

## Overview
This is a movie reservation app, by the name of FILMWORKS, which allows the user to select from the list of movies and buy tickets to be brought to a cinema in order to watch the movie. It allows users to select from different dates, timeslots, and number of tickets for the specific movie that the user wishes to watch. It also allows the user to see previously purchased movie tickets and shows whether the movie ticket date has already passed or not. This allows the user, if one wishes, to keep a copy of the ticket as a memento or also allows the user to take note of whether one still has time to go to the cinema and watch the indicated movie. The purchasing of movie tickets is done by selecting the quantity, timeslot, specific movie and adding it to cart and checking out.  The user is also expected to input a card number in order to have the movie tickets added to one's account. However, for safety purposes, the website would not be recording any card details and would just verify whether the card number inputed has the same length as a normal credit card. Actual transactions with actual payment would also not be simulated due to the constraints of this project. 

## NODEJS PACKAGES USED IN THIS PROJECT
1. express
2. express fileupload
3. express session
4. hbs
5. bcrypt
6. dotenv
7. mongoose 
8. save

## Website Details
* Name of Website: Filmworks
* Number of Movies Available: 10 Different Movies


## Guide
In order to run the code. Please follow the steps.
LOCAL INSTRUCTIONS
1. Go to the necessary folder and run node movies.js in CMD/terminal
2. If one wishes to use random test data for accounts, go to the necessary folder and run node users.js in CMD/terminal.
 - NOTE: The passwords listed in database are hashed, but if you know the actual password, it would still work.
 - Sample Accounts if one wishes to use it
 * Email: hello_world@gmail.com
 * Password: helloworld123

 * Email: k@gmail.com
 * Password: composer

 * Email: robin@gmail.com
 * Password: strawhats

 * Email: julianne@gmail.com
 * Password: programmer

 * Email: sherilyn@gmail.com
 * Password: programming


3. If not, one can also register one's own account manually.
4. Run node index.js to open the website
5. Go to your browser of choice and type localhost:3000 to enter the main page
6. Sign up or login in order to start buying movie tickets.

HEROKU INSTRUCTIONS
1. Go to https://ccapdevheroku.herokuapp.com to access the website
2. Sign up or login in order to start buying movie tickets.
3. The database has the sample users and same movies located in the local version of the project, so one can use those if one wishes to.
 - Refer to the account details in the LOCAL INSTRUCTIONS for the sample account details



## IMPORTANT NOTICE
The movies used in this application belong to their respective owners and these movies were only selected for simulating the website.