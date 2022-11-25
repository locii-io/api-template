import createServer from "./server/server";
import next from 'next';

// Create Express server
const port = 4000;
const app = createServer();

const nextAdmin = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: './admin',
})
const handle = nextAdmin.getRequestHandler()
nextAdmin.prepare()
    .then(() => {
        app.get('*', (req, res) => {
            return handle(req, res)
        })

        // Start Express server
        app.listen({ port }, () => {
            console.log(`Started server on port: ${port}`);
            console.log(`🚀 Apollo Server ready at http://localhost:${port}/graphql`);
            console.log(`🚀 REST Server ready at http://localhost:${port}/api`);
            console.log(`🚀 Admin Portal ready at http://localhost:${port}/admin/dashboard`);
        });
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })
