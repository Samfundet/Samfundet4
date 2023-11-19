#!/bin/bash

# Stop script on first failed command.
set -x


git pull

##################################
#            Backend             #
##################################

cd backend || exit
pipenv run pipenv:sync-prod
pipenv run migrations:apply
pipenv run static:collect
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
