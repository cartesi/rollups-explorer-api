# Code Generation

We use @graphql-codegen modules to help generate the complete graphql schema (Versioned) from the squid graphql and support the frontend development with hooks and types (non-versioned).

#### Development

During development, after updating the [backend graphql schema](../schema.graphql) in the project's root, the following command is necessary to generate the updated version of the complete graphQL schema.

> [!NOTE] > _Make sure your local docker postgres and graphQL server is running_

```
npm run codegen:squid-schema
```

Run the following command to generate hooks and types to support UI development ().

```
npm run codegen:graphql:ui
```

Also, you can run the following command that runs the previously mentioned ones sequentially.

```
npm run codegen:all
```
