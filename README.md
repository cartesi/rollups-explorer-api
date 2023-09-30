## Rollups Explorer Backend
[![Coverage Status](https://coveralls.io/repos/github/cartesi/rollups-explorer-api/badge.svg?branch=main)](https://coveralls.io/github/cartesi/rollups-explorer-api?branch=main)

Experimentation with subsquid as a new indexing protocol.

That project requires [docker](https://docker.com) to be installed so the backend can be used locally.

### Project structure

the following folders belongs to the `backend`

-   abi/
-   assets/
-   db/
-   lib/ (generated when building)
-   src/

### Development

The project is using the **npm** as the package manager to facilitate integration with subsquid, since that is the preferred choice.

There is a `.env` file with a few options to be setup.

Start installed the dependencies;

```console
npm install
```

For backend commands and more information, refer to docs [here](./docs/backend-commands.MD);
