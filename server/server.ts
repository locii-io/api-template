import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { typeDefs } from './schema'
import { resolvers } from './resolvers';
import models from './models';
import { configREST } from './rest';

export default function createServer() {
    console.log("Creating server...");

    const app = express();
    app.use(bodyParser.json());

    // Use Apollo Server as GraphQL middleware
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: { models },
    });

    async function startApolloServer() {
        await apolloServer.start();
        apolloServer.applyMiddleware({ app });
    }
    startApolloServer();

    // Initiate Sofa
    const rest = configREST(typeDefs, resolvers, models);
    app.use('/api', rest.sofa);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(rest.definitions));

    return app;
}
