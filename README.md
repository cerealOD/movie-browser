Frontend application for my angular movie browser practice app. This project was built with Angular 20 and with the help of some external libraries:

[PrimeNg](https://primeng.org/) for pagination and icons

[TailwindCSS](https://tailwindcss.com/) for inline css

## Build

Run `npm install` to build the project. The build artifacts will be stored in the `dist/` directory.

## Development server

Run `npm start` to run the dev server

## Project Overview

This frontend app makes requests to the respective backend app in order to fetch movies and movie information from [TMBD](https://www.themoviedb.org/). It then displays this information in several pages. There are 4 list pages which show popular/top rated/now playing/upcoming movies in a grid structure with pagination.

Users can sign up and log in via forms, and they get assigned a JWT with 1 hour expiration by the backend. Once a user is signed in, they can favorite and unfavorite a movie on the movie's show page. Favoriting is not an available feature when not logged in. 

The app also has a favorites page that is also only accessible if the user is logged in. The favorites page shows the user's favorited movies and the user is able to remove any movie from the list.
