#!/bin/bash

echo "Enter database id of movie you want to remove:"

read MOVIE_ID

python admin.py remove-movie-id MOVIE_ID