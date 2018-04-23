# Growing Habit
A lifestyle SPA that tracks and shares your development of new habits. Based on MongoDB+Node.js+Express+React+Antd, auth with JWT token. 

Instance: https://growing-habit.herokuapp.com/ (the cloud platform closes it when inactive, so booting-up may take some time)

Developed by HYYang

## Rules :

* Logged in or not, any user can browse shared habits

* After logging in, a user can cheer once for each habit

* After logging in, a user has all permissions on his/her own habits: browser/add/checkin/finish/delete

* Once per day, user can check in a habit to record one more day developing the habit

* Finishing a habit will render it \'finished\', restart a habit will reset the progress

* The percentage in the progress bar is based on studies that it took 66 days to develop a habit, or you can finish it to set the progress to 100%

* Deletion of a habit is unrecoverable

## Want to feddle with it?

git clone, npm i, npm start
