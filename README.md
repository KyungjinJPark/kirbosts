# `Kirbosts` 👾

`Kirbosts` is a reddit-like web app created for fullstack CRUD (Create, Read, Update, Delete) app development practice. 

## Features

### App

- CRUD Bosts (Posts)
- User accounts

### Dev

- TypeScript
- TS watch w/ nodemon
- Running seperately installed PostgreSQL server software
  - Database name: `kirbosts`
- MikroORM
- Express + Apollo GraphQL API
  - interacts w/ MikroORM

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
- To handle user sessions:
  - On login, store a cookie in user browser