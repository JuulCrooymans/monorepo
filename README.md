# Monorepo setup

## Getting started

First install all dependencies with:

```bash
$ yarn
```

Than create a .env file in packages/db and set `DATABASE_URL` (You can change the variables in docker-compose.yml)

After you have created the .env inside of packages/db you can run the postgres and redis container with the command below:

```bash
$ yarn docker
```

Now that you have your database running, run the command below in a separate terminal to start developing

```bash
$ yarn dev
```
