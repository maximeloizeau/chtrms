#Technical test - Maxime LOIZEAU

## How long did you spend on the coding test?

* 1 hour 30 minutes - to do some research to help me decide what technologies to use. I had Redis in mind but also socket.io. I already knew that I wanted to develop it in Node.js as it is the tech I am the most proficient in right now. Also what impact would the database choice would have, but for a small project like that I decided not to be too picky and spend my time coding.

Finally I decided to just use socket.io to communicate in realtime with clients since it provides rooms and such.

* 8 to 10 hours - to design (data model, functionalities breakdown on paper) and build the service backend + front.
I decided to use a lightweight view framework for the Javascript so I "lost" some time to learn how to use it (which was interesting, I found it similar to Angular.js philosphy)

## What would you add to your solution if you had more time?

I always wanted to add more functionnalities but I thought I should stop at some point. My solution could use all of this :
* Save user webtoken to localstorage so they don't have to reconnect each time they open the page
* Take more time to think about the UI (to make it more modern) and adjust some issues : scrolling issue in the messages area
* Do a real error management on client side. At least, displaying that there was an error.
* CODE TESTING ! I made a stub of unit testing of some functions (user log in/out) but didn't take time to do a better coverage
* DOCUMENTATION

## How would you track down a performance issue in production? Have you ever had to do this?

I did it one time to find what was causing an old app to take that much time to process data. That time, I tried to time some functions that I was suspecting to be at fault and log the results. It helped to narrow down to the function.

And in general, I think you should observe every module to see if it's abnormally slow and then look into the code what could be wrong.


## Explaination about the app functionning

User login:
- Server authenticates with password and return the user object containing a JSON Web Token coupled with an expiration date

User logout:
- Server deletes the token so it can not be used again

Room creation:
- User makes a request to create a room with a specific (unique) name.
- Server saves the Room object
- Server send a notification to all connected client (via their open socket) so they can update their UI
- If the user creating the room is not yet connected to a socket, the room is added to the UI at the end of the request

Room joining:
- Client closes already active socket if any
- Client connects to a new socket and send a message saying that he wants to join the room 'x'
- Server adds the sockets to the room
- Client requests /api/rooms/{roomName}/messages to load old messages from the room (limit to 30)

Message sending:
- Client writes and send a new message, via a message on the open socket
- Server receives message, checks if provided token is valid to authenticate the user
- Server then save the message in the database, and broadcast it to all connected clients in the given room (including sender)
- All clients update their UI to display new message