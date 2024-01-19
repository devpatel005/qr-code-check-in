# QR-code-check-in
## A small project that can check in people using a QR code scanner from Expo in React Native. The app accesses the user's camera on their phone and is set to scan only QR codes. Another program (not included here) sends QR codes encoded with unique ID numbers, which the scanner picks up through the camera. The app then fetches a JSON file via API from a database containing all check-in info on the unique ID. The program then displays a modal with the information received from the API. 
### This app contains four possible cases and covers each.
### 1. The delegate (owner of a unique ID) does not exist. (API did not send any information back to the app).
### 2. The delegate is not registered. (API returned a nonregistered error code)
### 3. The delegate still needs to sign their liability form. (API returned not signed error code)
### 4. The delegate has successfully checked in. (API returns the success error code and all information on the delegate within the database, as well as changing the check-in status to true in the database)

## This app was developed because there were issues with check-in at larger events for my mandir ie, long lines due to the check-in wait time. This app and its corresponding database and website (created by the person I worked with) helped reduce check-in time from at least 5 minutes to a mere 7 seconds per person, a 96% increase in speed. 

### This app was built using React Native for compatibility across all mobile devices and used Expo to generate builds for use. The main libraries used were Expo QR scanner and Axios (for API fetching).

# Before Running, install all node and expo dependencies to run the app off a local server.
