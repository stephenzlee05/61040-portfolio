# Pset 1

## Exercise 1

1. Invariant 1: The purchase count for an item will not be greater than the requested count in that registry. Invariant 2: Every purchase must correspond to an existing request in the same registry. Invariant 1 is more important because it guarantees the registry’s correctness for both users: recipients can see how many items are still available, and givers won’t think they can purchase an item that’s already been fully claimed. The purchase action is the most affected by this invariant. The action requires the request to have at least count available. Then it both creates the purchase and decrements the request count at the same time.

2. The removeItem action may break the invariant because when it removes a request, it doesn't handle existing purchases for that item. This leads to purchases for the item still existing while there is a nonexisting request count. One way to fix this is to prevent removal when purchases exist by adding the condition that requires request exist and request has no purchases.

3. A recipient might want to temporarily hide the registry, for example, while making edits, or if they are waiting for a new batch of items to be added. Then they might reopen the registry if new friends want access, or if the event is rescheduled. Allowing a registry to be opened and closed repeatedly allows the users control over their registry's visibility.

4. Having no registry deletion action would matter because users would not be able delete their old, unwanted registries. Despite being able to close the registry, there is no way to undo accidental registry creation and registries may build up over time, taking up space.

5. A common query by the registry owner may be what items have been purchased from my registry and by whom. A common query by the gift giver may be what items are still available to purchase from this registry.

6. To hide purchases from the recipient, add a hidePurchases flag to the Registry state which controls whether purchases are visible to the owner. Then add new actions hidePurchases (registry: Registry) which requires registry exists and effects set hidePurchases to true for this registry. Similarly showPurchases (registry: Registry) requires registry exists and effects set hidePurchases to false for this registry.

7. Using a generic Item and User type is preferable because it allows the entire concept to be simple to understand, focusing on the core logic rather than specific details. More complex ideas, such as representing items with their names, descriptions, prices, are flexible to implement in the future as the concept works with any type of item representation. The design choice makes the GiftRegistration concept a reusable specification that can be adapted to different scenarios.

## Exercise 2

1. **state**  
a set of Users with  
a username String  
a password String

2. **actions**  
register(username: String, password: String): (user: User)  
requires username is not empty and no user exists with this username
effects create a new user with this username and password and return the new user<br><br>
authenticate(username: String, password: String): (user: User)
requires a User exists with this username and password  
effects return the matching User

3. The invariant is that each username must be unique across all users in the system. This invariant is preserved in the action register, which requires the username to not match any other username in the system.

4. **state**  
a set of Users with  
a username String  
a password String  
a confirmed Flag  
a secretToken String  

**actions**
register(username: String, password: String): (user: User)  
**requires** username is not empty and no user exists with this username  
**effects** create a new user with this username and password  
set user.confirmed = false  
set a random secretToken  
and return the new user and secretToken<br><br>
confirm(username: String, token: String)  
**requires** a User exists with this username  
user.confirmed = false  
user.secretToken = token  
**effects**  
set user.confirmed = true  
set user.secretToken = null  <br><br>
authenticate(username: String, password: String): (user: User)  
**requires** a User exists with this username and password  
user.confirmed = True
effects return the matching User

## Exercise 3

**concept** PersonalAccessToken  

**purpose**  
Provide secure, token-based authentication for accessing GitHub resources via the API or command line, serving as an alternative to password-based authentication.

**principle**  
After a user generates a personal access token, they can authenticate using their GitHub username and the token, which acts as a substitute for their password.

**state**  
a set of Users with  
a username String  
a set of Tokens with  
a tokenValue String  
a Scopes Set  
an expirationDate DateTime  
a creationDate DateTime  
a isActive Flag  

**actions**  
createToken (user: User, scopes: Set, expirationDate: DateTime): (token: Token)  
**requires** user is authenticated AND scopes are valid  
**effects** create a new token with the specified scopes and expiration 
token.isActive = true   
add it to the user's set of tokens  
return the token  <br><br>
revokeToken (user: User, token: Token)  
**requires** user is authenticated AND token is owned by user  
**effects** set token.isActive to false  <br><br>
authenticateWithToken (tokenValue: String): (user: User)  
**requires** token exists with tokenValue
token is active  
and token.expirationDate > currentDate  
**effects** return true if token matches and is active, else return false  

The PersonalAccessToken allows for permission scopes, multiple credentials and expiration date compared to PasswordAuthentication which does not have these features. PersonalAcceessToken can also be used through API access, Git operations, and automation. Github documentation should explain why users should use a PersonalAccessToken and its various features, compared to a traditional password model.

## Exercise 4

**concept** URLShortener (User)

**purpose** map long URLs to short for easy sharing

**principle** a user creates a short URL by supplying a long URL and optionally a custom suffix;  
if no suffix is supplied, the system generates a unique suffix;  
the system stores a mapping between the suffix and the original long URL;  
when someone requests the short URL, the service retrieves the associated long URL and redirects the user to it.

**state**  
a set of Links with  
an owner User
a longUrl String
a suffix String  

**actions**  
create (owner: User, longUrl: String, customSuffix: Optional String): (link: Link)  
**requires** customSuffix is not in use  
**effects**  if customSuffix then create new Link with longURL, suffix = customSuffix  
else generate a unique valid suffix and create new Link with longURL, suffix = generated  
return created Link

delete (owner: User, suffix: String)  
**requires** Link exists with suffix and Link.owner = owner  
**effects** deletes Link

**concept** Conference Room Booking (User)

**purpose**  manage reservations of conference rooms to prevent double booking  

**principle** a user requests a booking by specifying a room, start time, and end time;  
the system checks whether the room is free during that time;  
if available, the system creates a reservation and associates it with the user;  

**state**  
a set of Rooms with  
a roomId String  
a location String  

a set of Bookings with  
a booker User  
a room Room
a startTime DateTime  
an endtime DateTime  

**actions**  
createBooking (booker: User, room: Room, startTime: DateTime, endTime: DateTime): (booking: Booking)  
**requires** room exists and currentDateTime <= startTime < endTime  
and no overlapping booking exists for this room between startTime and endTime  
**effect** create a new Booking with booker, room, startTime, endTime and return the booking

cancelBooking (user: User, booking: Booking)  
**requires** booking exists AND booking.booker = user  
**effects** set delete booking

**concept** ElectronicBoardingPass (User)

**purpose** provide passengers with digital boarding passes that display real-time flight information and enable airport access

**principle** a passenger receives a boarding pass for a confirmed flight reservation;  
the boarding pass contains static passenger and flight information plus dynamic gate and time data;  
the pass is updated in real-time to reflect schedule changes and gate assignments.

**state**  
a set of BoardingPasses with  
a passenger User  
a flight Flight  
a passId String  
a seat String  
a boardingGroup String  
a lastUpdated DateTime

**actions**  
createBoardingPass (passenger: User, flight: Flight, seat: String, boardingGroup: String): (boardingPass: BoardingPass)  
**requires** passenger exists and flight exists and seat is valid for flight and boardingGroup is valid  
**effects**  generates a random passId that does not exist  
create a new BoardingPass with passenger, flight, seat, boardingGroup, set boardingPass.lastUpdated to currentDateTime and return the boarding pass

updateBoardingPass (boardingPass: BoardingPass): (updatedPass: BoardingPass)  
**requires** boardingPass exists  
**effects** set boardingPass.lastUpdated to currentDateTime  
return the updated boarding pass with current flight information
