module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "realtime_event_db",
      user: "your_username",
      password: "your_password",
      port: 5432,
    },
    migrations: {
      directory: "./migrations",
    },
  },
  test: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "realtime_event_db_test",
      user: "your_username",
      password: "your_password",
      port: 5432,
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
