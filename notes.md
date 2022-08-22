```bash

docker run --name devkb-redis -d --network devkb-net redis

# has a section on secrets on docker hub page
docker run --name devkb-psql -d --network devkb-net \
  -v /home/koi/volumes/postgresql/data:/var/lib/postgresql/data \
  -e POSTGRES_DB=[dbname] \
  -e POSTGRES_USER=[dbuser] \
  -e POSTGRES_PASSWORD=[dbpass] \
  postgres

docker run --name devkb-mw -dp 4000:4000 --network devkb-net kb-mw

docker run --name devkb-ui -dp 3000:3000 kb-ui

```