#!/usr/bin/env bash

# Get date and timestamp to ensure unique filenames.
# https://man7.org/linux/man-pages/man1/date.1.html
# https://www.geeksforgeeks.org/date-command-linux-examples/
# Structured like this: <date>__<timestamp>
# Outputs: <day>_<month>_<year>__<hours>_<minutes>_<seconds>
# Example: 19_11_2023__23_02_57
now="$(date +"%m_%d_%Y__%H_%M_%S")"
filename="backend/logs/deploy__$now.log"

echo "Running deploy script..."
echo "See logs in $filename"

# https://serverfault.com/questions/103501/how-can-i-fully-log-all-bash-scripts-actions
# Redirect all commands, results and errors to a log file.
exec 1> "$filename" 2>&1


# https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html
# -e: Stop script on first failed command.
# -x: Trace executed commands.
set -ex

# Fetch latest changes.
git pull

##################################
#            Frontend            #
##################################

cd frontend || exit
yarn run ci
yarn run build
cd ..

##################################
#            Backend             #
##################################

cd backend || exit
pipenv run pipenv:sync-prod
pipenv run migrations:apply
pipenv run static:collect
touch reload # Trigger restart of Apache server.
cd ..
