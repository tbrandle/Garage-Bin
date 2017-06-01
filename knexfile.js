// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/garage_bin',
    migrations: {
      directory: './db/migrations',
    },
    useNullAsDefault: true,
    seeds: {
      directory: './db/seeds/dev',
    },
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/garage_bin_test',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/test',
    },
    useNullAsDefault: true,
  }
  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
