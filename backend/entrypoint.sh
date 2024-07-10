#!/bin/sh

# Wait for PostgreSQL to be ready
./wait-for-it.sh db 5432 -- echo "PostgreSQL is up - executing command"

# Run database migrations
node-pg-migrate up

# Start the application
exec "$@"
