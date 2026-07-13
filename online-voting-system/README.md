# Online Voting System — Spring Boot + MongoDB

A simple college mini-project: create polls, vote once per email, view live results.
No Spring Security, no JWT, no Docker, no microservices — just a clean layered Spring Boot app.

## Tech Stack
- Java 17
- Spring Boot 3.3.2 (Web, Data MongoDB, DevTools, Lombok)
- MongoDB
- Maven
- Plain HTML/CSS/JS frontend (separate folder, see `voting-frontend/`)

## How to Run

1. **Start MongoDB** (must be running on `localhost:27017`).
2. **Import into Eclipse:** File → Import → Maven → Existing Maven Projects → select this folder.
3. Wait for Maven to download dependencies.
4. If Lombok isn't recognized, run the Lombok installer from the jar in your `.m2` repo and restart Eclipse.
5. Run `OnlineVotingSystemApplication.java` as a Java Application.
6. The API will be live at `http://localhost:8080`.

## Package Structure

```
com.voting.onlinevotingsystem
├── OnlineVotingSystemApplication.java
├── config/       -> WebConfig.java (CORS setup for frontend)
├── model/        -> Poll, PollOption, Vote, CreatePollRequest, VoteRequest
├── repository/   -> PollRepository, VoteRepository
├── service/      -> PollService (business logic + validation)
├── controller/   -> PollController (REST endpoints)
└── exception/    -> Custom exceptions + GlobalExceptionHandler
```

## API Endpoints

| Method | Endpoint             | Description              |
|--------|-----------------------|---------------------------|
| POST   | /polls                 | Create a new poll         |
| GET    | /polls                 | Get all polls              |
| GET    | /polls/{id}             | Get one poll by ID         |
| POST   | /polls/{id}/vote        | Vote on a poll              |
| GET    | /polls/{id}/results      | View results for a poll     |

## Testing
Import `voting-system.postman_collection.json` into Postman. Create a poll first, copy its `id`
into the `pollId` collection variable, then test the rest of the endpoints.

## Frontend
See the separate `voting-frontend/` folder (`index.html`, `style.css`, `script.js`).
Just open `index.html` in a browser while the backend is running on port 8080.
