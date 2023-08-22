## Rollups Explorer

Experimentation with subsquid as a new indexing protocol. Also using nextJS 13 but the `pages/` directory for the frontend.

That project requires [docker](https://docker.com) to be installed so the backend can be used locally.

### Project structure

the following folders belongs to the `backend`

-   abi/
-   assets/
-   db/
-   lib/ (generated when building)
-   src/

The following folders are meant for the `frontend`

-   pages/
-   components/
-   graphql/ (definition for the graphql-tools autogeneration)

The following work in conjunction with `deployment`

-   scripts/

> There is a conflicting situation between subsquid and nextJS use of tsconfig.json. So the scripts inside this folder are used only when the deployment command is called using the [Pre & Post scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts#pre--post-scripts).

### Development

The project is using the **npm** as the package manager to facilitate integration with subsquid, since that is the preferred choice.

There is a `.env` file with a few options to be setup.

Start installed the dependencies;

```console
npm install
```

For backend commands and more information, refer to docs [here](./docs/backend-commands.MD);

#### Frontend

```shell
npm run dev
```

#### Reference docs

A squid template information can be found [here](./docs/squid.MD)
