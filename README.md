# Drawbridge

Lets you draw collaboratively in real time. written using Node.js for Node Knockout 2010!

NodeKO Entry: http://nodeknockout.com/teams/team-hyphen

# Installation

Platform requirements: node, mysqld
Install from npm: express, socket.io, mysql

You'll need to create a database. Once that's done, put username/password
info in config.js, and load in the scheme from the included db dump:

    mysql -u USERNAME -p DBNAME < sql/drawbridge_base.sql

Once that's done, you should be able to run it:

    node server.js <PORT>

The default port is 80 if none is specified.

