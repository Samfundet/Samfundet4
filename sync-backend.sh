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
# og staging.

# Sørg for at update-backend-on-remote.sh er
# executable av gruppa (lim-web) og at det har
# setuid samfundet-httpd (eller tilsvarende)
ssh cirkus "${REMOTE_PATH}/update-backend-on-remote.sh"
