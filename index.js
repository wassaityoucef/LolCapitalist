const express = require('express');
const fs = require('fs').promises;
 const { ApolloServer, gql } = require('apollo-server-express');
// Construct a schema, using GraphQL schema language
const typeDefs = require("./schema")
const cors = require('cors');

// Provide resolver functions for your schema fields
const resolvers = require("./resolvers")
let world = require("./world")

const server = new ApolloServer({
    typeDefs, resolvers,
    context: async ({ req }) => ({
    world: await readUserWorld(req.headers["x-user"]),
    user: req.headers["x-user"],

    })
   });
   
const app = express();

async function readUserWorld(user) {
    try {
      const data = await fs.readFile("userworlds/" + user + "-world.json", "utf8");
      if (data) {
        return JSON.parse(data);
      } else {
        return world; // ou une autre valeur par défaut appropriée
      }
    } catch (error) {
      return world; // ou une autre valeur par défaut appropriée
    }
  }

app.use(express.static('public'));
// Ajoute le middleware cors à l'application Express
app.use(cors());
server.start().then( res => {
 server.applyMiddleware({app});
 app.listen({port: 4000}, () =>
 console.log(`🚀 Server ready at
http://localhost:4000${server.graphqlPath}`)
 );
})
