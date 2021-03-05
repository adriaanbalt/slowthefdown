#!/bin/bash

echo "Enter IMDB id of movie you want to add:"

read MOVIE_ID

python admin.py add-movie-from-imdb MOVIE_ID