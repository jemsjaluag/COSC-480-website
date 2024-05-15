James Jaluag
COSC – 480
Dr Tankeh

This document assumes that the machine already has Node.js and Git installed. If not, please obtain the software here:
Node.js: https://nodejs.org/en/download/current
Git: https://github.com/git-guides/install-git

Step 1: Setting up MySQL database
1.	Download the MySQL installer which includes the MySQL CLI and Workbench:
https://dev.mysql.com/downloads/installer/ (Select the one with the most downloads).
If Workbench is not added automatically, click the Add button on the right and add the product.
2.	Open up Workbench and connect to the MySQL server.
3.	On the top, click the Create a new schema icon. Name the new schema “credentials” and then click Apply.
4.	Create a new user by clicking the Administration tab on the left and go to Users and Privileges. Click Add account, create the user of your own chosen credentials, and, on the Schema Privileges tab, click Add Entry, and add the CREATE, DROP, REFERENCES, SHOW VIEW, SELECT, INSERT, UPDATE, DELETE, EXECUTE privileges for the credentials schema. Click on Apply.

Step 2: Setting up Node.js and the application
1.	Create a folder, open the folder, right-click, and open Git Bash. (If you are using Windows 11, select “Show more options” after right-clicking.
2.	On the Git Bash, enter “git init” to initialise Git.
3.	Clone the application’s repository using the command: 
“git clone https://github.com/jemsjaluag/COSC-480-website.git”
4.	Open the folder “COSC-480-website”
5.	Open up the “.env” file using text editors.
6.	Change the variables “DB_PASSWORD” and “DB_USER” to the credentials of the account created previously. 
7.	On Git bash, run the command “node app.js” to run the application.
