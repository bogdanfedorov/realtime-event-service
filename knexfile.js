module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "realtime_event_db",
      user: "your_username",
      password: "your_password",
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
