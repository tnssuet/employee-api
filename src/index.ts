import { ApolloServer } from 'apollo-server';
import { resolvers } from './resolvers';
import { authMiddleware } from './middleware/authMiddleware';
import { typeDefs } from './schema';
import { createConnection } from 'typeorm';

(async () => {
  await createConnection();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authMiddleware(req)
  });

  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
})();