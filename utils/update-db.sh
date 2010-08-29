#!/bin/bash

. $HOME/config.sh

mysql -u$DB_USERNAME -p$PASSWORD $DATABASE < $MYSQL_FILE;
