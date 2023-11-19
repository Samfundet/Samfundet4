#!/bin/bash

# Stop script on first failed command.
set -x


git pull

##################################
#            Backend             #
##################################

cd backend || exit
pipenv run python manage.py migrate
pipenv run python manage.py collectstatic --noinput
touch reload
cd ..

##################################
#            Frontend            #
##################################

cd frontend || exit
yarn run ci
yarn run build
touch reload
cd ..

##################################
#            Finally             #
##################################
touch reload
