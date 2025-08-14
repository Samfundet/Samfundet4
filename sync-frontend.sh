#!/bin/bash
# dette scriptet kjører på klienten din :D
# putt noe slikt i din .ssh/config:
# Host cirkus
#   HostName cirkus.samfundet.no
#   User vsbugge
#
# Før du kjører scriptet må du sette REMOTE_PATH
# variabelen til hvor samfundet.no repoet ligger
# på cirkus. Dette bør være forskjellig fra prod
# og staging. frontend/dist bør ha setguid
# lim-web.

set -euo pipefail

cd frontend
yarn build
rsync -avz --no-o --delete \
    --chown=:lim-web \
    --chmod=Du=rwx,Dg=rwx,Do=rx,Fu=rw,Fg=rw,Fo=r \
    dist/ "cirkus:${REMOTE_PATH}/dist/"
