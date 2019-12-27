# Drag and Drop with Autosave

This is simple demo of an HTML5 Drag and Drop with autosave web app. Part 1 features the drag and drop functionality, as well as the ability to add and delete projects.

[The tutorial can be found here](http://atomicrobotdesign.com/blog/web-development/make-an-html5-drag-and-drop-project-list-with-autosave-part-1/)

# Updated for 2019 / PHP 7  --- Letter to Mike

I found this code and article you wrote back in 2012 to be useful while learning how to implement Drag & Drop Autosave.

http://atomicrobotdesign.com/blog/web-development/make-an-html5-drag-and-drop-project-list-with-autosave-part-2/

However, with it being over 7 years ago, as you can imagine, the code was a bit dated and no longer functional. (Depreciated PHP 5 era code, etc.)

I’ve re-worked the code so that it’s compatible with PHP 7, uses MySQLi and prepared statements for handling the DB connection, and have added some functionality so that each item has it’s own unique ID (so that it can be more easily adapted to real-world scenarios). 

The ID is inserted (in a data-id=“” attribute) following successful insertion of a new item to the database, and then saving subsequent drag/drop arrangement order to the database is performed according to the ID, not the actual list item text.

I’m also using jQuery for the AJAX calls, have switched it to POST vs. GET, and have added some error handling, and have put all the PHP/HTML code in a single file.

It’s setup now so that when you refresh the page, it looks the same. (vs. starting again from the initial view on your original code.)

I’ve also included some simple SQL to setup the database table with the required structure and initial data.

