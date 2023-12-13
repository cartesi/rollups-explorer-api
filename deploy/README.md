# Deploy Helpers

Folder holding scripts to support the API deployment process.

### Run script

Currently support deriving the database_url environment variable into expected ones for the processor and graphQL-server (e.g. DB_HOST, DB_PASS), then it starts the target applications with this new vars available.

> Check the script [here](./run) for more details.
