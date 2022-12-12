import createServer from './src/server';

// Create Express server
const port = 4000;
const app = createServer();

// Start Express server
app.listen({ port }, () => {
  console.log(`Started server on port: ${port}`);
  console.log(`🚀 Apollo Server ready at http://localhost:${port}/graphql`);
  console.log(`🚀 REST Server ready at http://localhost:${port}/api`);
  console.log(`🚀 REST Server docs ready at http://localhost:${port}/api-docs`);
});
