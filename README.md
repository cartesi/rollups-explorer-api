## Rollups Explorer Backend

[![Coverage Status](https://coveralls.io/repos/github/cartesi/rollups-explorer-api/badge.svg?branch=main)](https://coveralls.io/github/cartesi/rollups-explorer-api?branch=main)

This is a Subsquid Indexing protocol API for Cartesi Rollups Contracts and Applications.

That project requires [docker](https://docker.com) to be installed so the backend can be used locally.

### Configuration (Environment Variables)

> Supported Chains: 1, 11155111, 10, 11155420, 8453, 84532, 42161, 421614, 31337, 13370

|          Variables          |                 Default                  |                                                                                                                                                        Description                                                                                                                                                         |
| :-------------------------: | :--------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|         `CHAIN_IDS`         |                 `31337`                  |                                                                                                                                     Comma separated supported chain ids to be indexed                                                                                                                                      |
|         `RPC_URL_1`         |        `https://rpc.ankr.com/eth`        |                                                                                                                                               Endpoint for Mainnet RPC node                                                                                                                                                |
|     `RPC_URL_11155111`      |    `https://rpc.ankr.com/eth_sepolia`    |                                                                                                                                               Endpoint for Sepolia RPC node                                                                                                                                                |
| `RPC_URL_{31337 \| 13370}`  |         `http://127.0.0.1:8545`          |                                                                                                                                                  Endpoint for local node                                                                                                                                                   |
|        `RPC_URL_10`         |      `https://mainnet.optimism.io`       |                                                                                                                                           Endpoint for Optimism Mainnet RPC node                                                                                                                                           |
|     `RPC_URL_11155420`      |      `https://sepolia.optimism.io`       |                                                                                                                                           Endpoint for Optimism Sepolia RPC node                                                                                                                                           |
|       `RPC_URL_8453`        |        `https://mainnet.base.org`        |                                                                                                                                             Endpoint for Base Mainnet RPC node                                                                                                                                             |
|       `RPC_URL_84532`       |        `https://sepolia.base.org`        |                                                                                                                                             Endpoint for Base Sepolia RPC node                                                                                                                                             |
|       `RPC_URL_42161`       |      `https://arb1.arbitrum.io/rpc`      |                                                                                                                                               Endpoint for Arbitrum RPC node                                                                                                                                               |
|      `RPC_URL_421614`       | `https://sepolia-rollup.arbitrum.io/rpc` |                                                                                                                                           Endpoint for Arbitrum Sepolia RPC node                                                                                                                                           |
| `RPC_RATE_LIMIT_{CHAIN_ID}` |               `undefined`                | Option to fine tune concurrent requests by rate limiting the requests to RPC node providers. Replace {CHAIN_ID} with a supported chain id and set a Number e.g. 15. That is good to avoid [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) status code when using free tiers. The default is Full speed |

For use with local devnet for fine tunning and deal with any unexpected changes e.g. Foundry nightly versions.

|          Variables          | Default |                                     Description                                      |
| :-------------------------: | :-----: | :----------------------------------------------------------------------------------: |
|    `GENESIS_BLOCK_31337`    |  `22`   |                          Genesis block for indexer to start                          |
| `BLOCK_CONFIRMATIONS_31337` |   `1`   | Distance from the head block behind which all blocks are considered to be finalized. |

Subsquid Related variables on Development mode. Check the docker-compose and commands.json files.

| Variables  |   Default   |        Description         |
| :--------: | :---------: | :------------------------: |
| `DB_NAME`  |   `squid`   |       Database name        |
| `DB_PORT`  |   `5432`    |  Database port to be used  |
|  `DB_SSL`  |   `true`    | Config for SSL connections |
| `DB_PASS`  | `postgres`  |     Database password      |
| `DB_HOST`  | `localhost` |       Database host        |
| `DB_USER`  | `postgres`  |       Database user        |
| `GQL_PORT` |   `4350`    |      GraphQL API port      |

### Development

The project is using the **npm** as the package manager to facilitate integration with subsquid, since that is the preferred choice.

There is a `.env` file with a few options to be setup.

Start installed the dependencies;

```console
npm install
```

For backend commands and more information, refer to docs [here](./docs/backend-commands.MD);
