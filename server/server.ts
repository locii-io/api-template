import express from 'express';
import { useSofa, OpenAPI } from 'sofa-api';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import * as swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import { typeDefs } from './schema'
import { resolvers } from './resolvers';
import models from './models';

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

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    const openApi = OpenAPI({
        schema,
        info: {
            title: 'Example API',
            version: '1.0.0',
        },
    });

    // Initiate Sofa
    app.use('/api', useSofa({
        basePath: '/api',
        schema,
        context: { models },
        onRoute(info) {
            openApi.addRoute(info, {
                basePath: '/api',
            });
        }
    }));

    const openApiDefinitions = openApi.get();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDefinitions));

    return app;
}
