# `Kirbosts` 👾

`Kirbosts` is a reddit-like web app created for fullstack CRUD (Create, Read, Update, Delete) app development practice. 

## Features

### App

- CRUD Bosts (Posts)
- User accounts
- User sessions

### Dev

- TypeScript
- TS watch w/ nodemon
- Running seperately installed PostgreSQL server software
  - Database name: `kirbosts`
- MikroORM
- Express + Apollo GraphQL API
  - interacts w/ MikroORM
- Express Sessions + Redis

## Tech

- React
- TypeScript
- GraphQL
- URQL/Apollo
- Node.js
- PostgreSQL
- TypeORM
- Redis
- Next.js
- TypeGraphQL

## Misc

### Etymology

A certain pink, floaty, ball-like character is the mascot of a discord server I am in. `Kirbosts` is derived from a combination of that character's name and the word "posts".

### Credits

The creation of this app follows [this tutorial](https://youtu.be/I6ypD7qv3Z8) by [Ben Awad](https://www.youtube.com/c/BenAwad97).

### Notes to Self

- Use `sudo systemctl start postgresql.service` to check if PostgreSQL is runnning
- WSL doesn't have `systemctl start postgresql.service`, so use `service postgresql start`
- When using MikroORM, put all new `entity`s in the init and make a new entity definition file
- This does not automatically create the entity table in PostgreSQL
  - Use CLI to create migrations. Then add code to run migration in `main`
- Sometimes, Apollo resolvers need access to `ORM`
- Tuto said I need `import 'reflect-metadata'` in index.ts, but it's working without so far...
  - Though, GQL does require it, so I guess I'll do it
- To handle user sessions: (all implemented by express-session + plugins)
  - On login, place cookie in user browser
    - Cookie (random-seeming hash) is a signed (using the secret) key into Redis database
  - In Redis databse, that key (unsigned version i think) points to session data (e.g. {userId: 896})
  - This cookie will be passed to the server with every user request
  - Express gets redis obj for that key and passes it to the Apollo middleware
  - Apollo passes it to the handlers in the context's `req.session`