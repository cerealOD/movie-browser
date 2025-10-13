Frontend application for my angular movie browser practice app. This project was built with Angular 20 and with the help of some external libraries:

[PrimeNg](https://primeng.org/) for pagination and icons

[TailwindCSS](https://tailwindcss.com/) for inline css

## Build

Run `npm install` to build the project. The build artifacts will be stored in the `dist/` directory.

## Development server

Run `npm start` to run the dev server

## Production

The app is deployed on Netlify: https://movie-browser-showcase.netlify.app/

## Project Overview

This frontend app makes requests to the respective [backend app](https://github.com/cerealOD/movie-backend) in order to fetch movies and movie information from [TMBD](https://www.themoviedb.org/). It then displays this information in several pages. There are 4 list pages which show popular/top rated/now playing/upcoming movies in a grid structure with pagination configured with PrimeNG paginator.

When clicking on a movie, the app routes to the movie's show page. Here we can see more detailed information about the movie, such as genres it belongs to, release date, runtime, score, short overview of the plot, first 12 cast members and top 12 similar movies. The movie's IMDB link is also added here.

There is also a search feature where users can search for movies by typing to the search bar. The app returns search results from TMBD and they are displayed with pagination.

Users can sign up and log in via forms, and they get assigned a JWT with 1 hour expiration by the backend. Once a user is signed in, they can favorite and unfavorite a movie on the movie's show page. The app also has a favorites page that is also only accessible if the user is logged in. The favorites page shows the user's favorited movies and the user is able to remove any movie from the list. The user is logged out if they visit the /favorites page after their token expired and favoriting is not an available feature when not logged in. 

When designing the app, Figma was used to try out color combinations, fonts and layouts. The main logo was also "put together" by me in Figma, though it is very minimalistic. The app is also fully responsive, and is smoothly usable on any screensize. The styles in the app are a combination of using Tailwind for non-reused styles and plain css for reused styles.

## Possible Improvements and Additions

This app was created in exactly 2 weeks, so there is a LOT that could be added to this app in terms of features. Right now this is a demo app through which I practiced angular, therefore mainly focusing on trying out services, observables, inputs etc. Firstly, there is no real connection to a db, the users and favorites are stored in JSON files in the backend. My first improvement would be to have a Postgres db hosted, and connect the app to that instance. Many extra features could be added, for example creating personal watchlists (apart from the precoded favorites), watchlist management like multiselect remove or having a rearrangable order for saved movies and editing the user profile (password change, username change). 
