# Weather App - client app
Client part of weather monitoring app project.

Live demo: https://4meters.github.io/weather-app/ (wait 1 minute for marker display, server is hosted on fly.io, so needs time to boot from sleep)

Server app: https://github.com/4meters/weather-server

Measure script: https://github.com/4meters/weather-measure-script

## Main features:
- Map of stations
- Archival data presented with chart
- Login and register
- Add new station on map
- User station list
- Administrative panel

## Technologies used for implementing project
### Database:
- MongoDB

### Server:
- Java
- Maven
- Spring Boot
- Spring Boot MongoDB

### Client:
- React
- JS
- HTML

### Weather Station
- Python
- bme280 & sds011 python library

## React libraries used for creating client app:
- date-fns
- react-icons
- leaflet
- react-flex
- recharts
- react-editext
- react-minimal-side-navigation
- react-datetime-picker
- react-router-dom

## How to run:
Node 16+ required

In cmd, in main project directory:

`npm install`

`npm start`
