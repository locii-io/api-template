require('dotenv').config();
import createServer from "./server/server";

// Create Express server
const port = 4000;
const app = createServer();

// Start Express server
app.listen({ port }, () => {
    console.log(`Started server on port: ${port}`);
    console.log(`🚀 Apollo Server ready at http://localhost:${port}/graphql`);
    console.log(`🚀 REST Server ready at http://localhost:${port}/api`);
});
