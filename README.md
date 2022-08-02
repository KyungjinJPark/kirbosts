# `Kirbosts` 👾

Amongst the friend group, we share a lot of memes, jokes, and random posts that originate from sites like Reddit and Twitter. I want to make a reddit-like app where we can repost the posts, or `bosts`, for eachother.

In actuality, `Kirbosts` was created for fullstack CRUD (Create, Read, Update, Delete) app development practice. 

<!-- 🎉 [Create your own bosts here!](https:// hee hee /) 🎉 -->

## Features

<!-- TODO: business-englishify this section -->

## User Features

- Web client
- CRUD Bosts (Posts)
  - Kirbs (Votes)
- User accounts
- User sessions
- Forgot password

## Dev Tech

###### a.k.a. Name Dropping

### Server

- `TypeScript` + watch w/ nodemon
- `PostgreSQL` server
- `TypeORM`
- `Express` + `Apollo` + `GraphQL API`
  - interacts w/ `TypeORM`
- `Express Sessions` using `Redis` server
- Password reset w/ `Nodemailer`
  - uses `Redis` to manage [tokens?]

### Webclient

- `React` + `Next.js` 
- `Chakra-ui`
- `URQL` + `GraphQL client`
- `GraphQL Code Generator`
- server side rendering with `next-urql`
- resolvers use middleware for PEP

---

## Etymology

A certain pink, floaty, ball-like character is the mascot of a discord server I am in. `Kirbosts` is derived from a combination of that character's name and the word "posts".

###### please don't C&D me

## Credits

The creation of this app follows [this tutorial](https://youtu.be/I6ypD7qv3Z8) by [Ben Awad](https://www.youtube.com/c/BenAwad97).

## Learning Notes

Timestamp: 6:00

- Use `sudo systemctl start postgresql.service` to check if PostgreSQL is runnning
- WSL doesn't have `systemctl start postgresql.service`, so use `service postgresql start`
  - Database name: `kirbosts`
- When using TypeORM, put all new `entity`s in the init and make a new entity definition file
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
- Temember to run `watch` AND `dev`. I forgot and spent more time than I'd like to admit trying to debug some seemingly CORS issue.
- To provide the webclient code with the types from the tgql schema, use graphql-codegen
  - Workflow:
    - Add GQL operation to src/graphql/**/\*.graphql
    - `npm run gen`
    - Use the generated hook to call the mutation
- Some repeated queries will not return new values because of the urql cache
- `> organize inputs` to organize inputs
- Server side rendering is good for SEO
  - With SSR, fetched data will show up in page source w/o having to evaluate JS
  - Note: SSR only works for the first page you load. Subsequent pages are routed client-side AND gql requests are performed on the client
  - Note: you can delay queries based on whether the window variable is set to not SSR things on an SSR page
