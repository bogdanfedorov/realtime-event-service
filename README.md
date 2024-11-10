# Realtime Event Service

This project is a real-time event management service built with Nest.js, using a microservices architecture. It utilizes Redis for pub/sub and caching, Socket.io for real-time client communication, and Knex for PostgreSQL database interactions.

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/realtime-event-service.git
   cd realtime-event-service
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the environment:
   Copy the `.env.example` file to `.env` and update the variables as needed.

4. Start the Docker containers for PostgreSQL and Redis:

   ```
   docker-compose up -d
   ```

5. Run database migrations:
   ```
   npx knex migrate:latest
   ```

## Running the Application

To start the application in development mode:

```
npm run start:dev
```

The application will be available at `http://localhost:3000`.

## Running Tests

To run the test suite:

```
npm run test
```

## Project Structure

- `src/event-service`: Event management service
- `src/websocket-service`: WebSocket service for real-time updates
- `src/shared`: Shared services (Database, Redis, Data Processor)
- `migrations`: Database migration files

## API Endpoints

- POST /events: Create a new event
- GET /events: Get all events
- GET /events/:id: Get a specific event
- PUT /events/:id: Update an event
- DELETE /events/:id: Delete an event

## WebSocket Events

- `eventUpdate`: Emitted when an event is created, updated, or deleted
- `recentEvents`: Emitted every 5 minutes with grouped recent events

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
