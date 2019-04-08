# درباره این پروژه

سامانه مدیریت سهام تعاونی

# Commands

Insert Admin User Data to database

mongoimport --db TaavoniDb --collection  claims --file dbInit\Claims.json
mongoimport --db TaavoniDb --collection  users --file dbInit\AdminUserData.json
mongoimport --db TaavoniDb --collection noefiles --file dbInit\NoeFile.json