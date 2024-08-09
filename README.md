## CSSECDV - Milestone Two Guide
In order to run the code. Please follow the steps.

1. Run npm install to download all dependencies.
2. Copy the .env file to the root folder and change the database credentials to match your own local database configuration
3. Go to config > config and change the db credentials to match your own local db configuration
4. Create a blank database schema locally with the name milestoneone
5. If setting up for the first time, run the script "npm run db:setup" to create the tables and populate them
6. Run npm start to start the application
7. Go to your browser of choice and type https://localhost:3000 to enter the main page
8. Sign up and create a user account
9. Login based on the registered account details to view/perform user features
10. You can also decide to login using the admin account to view/perform admin features 
11. In order to use the admin account, input the following:
    Email: tetsukasuya@gmail.com
    Password: TetsuPassword00!!

On checking logs, take note of the following:
- When the environment is set to "development", logs will only output to the console
- When the environment is set to "production", log files will automatically be created.
  To view them, navigate to the "logs" folder from the root directory
