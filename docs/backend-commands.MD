# Backend

Here is a more detailed explanation to get the backend up and running locally.

_Generate models based on schema.graphql definitions_

```shell
npm run sqd:codegen
```

_Generate types from ABIs inside the `abi/` folder_

```shell
npm run sqd:typegen
```

_To build and generate the lib/ folder_

```shell
npm run sqd:build
```

_Run the following to get your database up and running_ (to destroy the database, just replace `up` with `down`)

```shell
npm run sqd:up
```

_Run the following only in case the schema.graphql for a change_

```shell
npm run sqd:migration:generate
```

_That will start indexing one of the supported networks of your choosing_

```shell
npm run sqd:process
```

_To start the GraphQL API_

```shell
npm run sqd:graphql
```

## Running Locally

When running locally most of the npm actions will use the [commands.json](../commands.json) definitions under the hood. That is the reason we have a [`tsconfig.squid.json`](../tsconfig.squid.json) so we leave the main one to be used by NextJS avoiding problems like "the build mixing up with the nextJS build".

> [!NOTE]  
> For more information related to subsquid check the [official documentation](https://docs.subsquid.io/)

_PS: It is up to you but you don't have to install the @subsquid/cli as it is a dev dependency here. you also have a npm script called `sqd` so you can pass any of the flags._
