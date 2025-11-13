# Requirements

## Game Overview

**Glugg** is a multiplayer word-forming game where players compete to find valid words from a shared set of random letters.

### Core Mechanics
- Games consist of **multiple rounds** (configurable per lobby)
- Each round presents **the same set of random letters** to all players
- Players race to form valid English words using those letters
- **First to submit wins** - once a word is guessed by any player, it becomes blocked for everyone else
- Players earn **1 point per letter** in each valid word
- After the round timer expires, a new round begins with a new set of letters
- The player with the **highest total score** across all rounds wins

### Game Flow
1. Players join a lobby (public or private)
2. Host/system starts the game when ready
3. Round 1 begins - all players see the same letters
4. Players submit words as fast as possible
5. Submitted words appear in real-time in each player's "word pile"
6. Round ends after time limit
7. Repeat steps 3-6 for remaining rounds
8. Display final scores and winner

## Functional

### RF01 - Play as Guest or Registered User

Players can participate in games either:
- **Anonymously** (guest) - no account required, randomly assigned display name
- **As a registered user** - with persistent username and game history

### RF02 - Create Public Lobby

Players can create a public lobby with configurable settings:
- **Number of rounds** per game (default: configurable, e.g., 3-10 rounds)
- **Round duration** in seconds (default: 60 seconds, range: 30-120 seconds)
- **Maximum players** (default: 20, range: 2-20)
- **Lobby name** (optional, auto-generated if not provided)

Public lobbies appear in the lobby list for anyone to join.

### RF03 - Browse and Join Public Lobbies

Players can view a list of public lobbies showing:
- Lobby name
- Current player count / maximum players
- Game configuration (rounds, duration)
- Game status (waiting, in-progress)

Players can select and join any lobby that is not full and hasn't started yet.

### RF04 - Quick Match (Random Public Lobby)

Players can join a random available public lobby with one click.
The system selects a suitable lobby that:
- Has not started yet
- Has available player slots
- Prioritizes lobbies closer to being full

### RF05 - Create Private Lobby

Players can create a private lobby with the same configuration options as public lobbies.
The system generates a unique join code that can be shared with friends.

### RF06 - Join Private Lobby with Code

Players can join a private lobby by entering the unique join code.

### RF07 - Submit Words and Score Points

During each round, players can:
- Type and submit words formed from the current round's letters
- Submit as many valid words as possible before the round ends
- Earn **1 point per letter** in each valid word
- See immediate feedback on word submission (accepted/rejected)

Word validation requirements:
- Must be a valid English word (checked against dictionary API)
- Must use only letters from the current round's letter set
- Must not have been already submitted by another player in this round
- Minimum word length (e.g., 3 letters)

### RF08 - Real-time Word Display and Blocking

Players see in real-time:
- **Their own word pile**: All words they've successfully submitted
- **Other players' word piles**: All words each opponent has submitted
- **Visual feedback**: New words animate/drop into the respective player's pile

**Word blocking mechanism**:
- Once any player successfully submits a word, it becomes **blocked for all other players**
- Other players attempting to submit the same word receive a "word already taken" message
- This creates a race dynamic - fastest submission wins

### RF09 - Leave Game

Players can leave a game at any time:
- During lobby waiting phase - player is removed from lobby
- During active game - player is removed, their score is recorded as-is
- After game ends - player returns to main menu

### RF10 - View Game Results

At the end of the game, display:
- **Final leaderboard** ranked by total score
- Each player's score breakdown:
  - Total score
  - Words submitted per round
  - Points earned per round
- **Winner announcement** with visual emphasis
- Option to return to lobby list or create new game

### RF11 - User Account Management

**Account Creation**:
- Register with username and password
- Username must be unique
- Password requirements (minimum length, etc.)

**Account Management**:
- Change password (requires current password verification)
- Disable account (soft delete - data retained but account inaccessible)

### RF12 - Game History

Registered users can view their game history showing:
- List of past games with date/time
- Final score for each game
- Final rank/placement in each game
- Number of words found
- Total games played, wins, average score (statistics)

### RF13 - Inactive Player Management

Players are automatically kicked if inactive:
- **In lobby**: Kicked after X minutes of inactivity (configurable)
- **During game**: Kicked after missing Y consecutive rounds or Z seconds without interaction
- Use WebSocket heartbeat/ping mechanism to detect disconnections
- Kicked players' scores are saved if they were in an active game

### RF14 - Letter Set Generation

The system generates playable letter sets for each round:
- **Letter distribution**: Based on English language letter frequency (more vowels, common consonants)
- **Minimum word guarantee**: Each letter set must allow for a minimum number of valid words (e.g., at least 50 possible words)
- **Difficulty balancing**: Avoid impossible combinations (e.g., "XYZ", "QQQ")
- **Length**: Configurable letter set size (e.g., 10-15 letters)
- **Randomization**: Different letter sets for each round
- **Validation**: Pre-check letter sets against dictionary to ensure playability

### RF15 - Game Start Conditions

A game in a lobby can start when:
- **Minimum players reached**: At least 2 players in the lobby
- **Host/creator triggers start**: Manual start by lobby creator
- **OR Auto-start**: After X seconds when minimum players met (optional, configurable)
- Players cannot join once the game has started

### RI01 - User Data Storage

For each user account, store:
- **username** (unique, indexed)
- **password** (hashed with bcrypt)
- **enabled** (boolean - for account disable/soft delete)
- **created_at** (timestamp)
- **updated_at** (timestamp)

### RI02 - Game History Storage

For each completed game, store:
- **game_id** (unique identifier)
- **started_at** and **ended_at** (timestamps)
- **configuration**: number of rounds, round duration, letter sets used
- **players**: List of player scores:
  - **user_id** (nullable - null for anonymous players)
  - **final_score** (total points)
  - **rank/placement** (1st, 2nd, etc.)
  - **words_submitted** (array of words per round)
  - **points_per_round** (array of scores per round)

### RI03 - Active Game State (Cache)

Store in Redis for active games:
- **Lobby state**: players waiting, lobby settings
- **Game state**:
  - Current round number
  - Current letter set
  - Time the round started
  - Words already submitted (for blocking)
  - Real-time player scores

## Non-Functional

### RNF01 - Technology Stack

#### Back-end
- Framework: NestJS with TypeScript
- WebSocket: Socket.IO for real-time communication
- Database: PostgreSQL for persistent storage (users, game history)
- Cache: Redis for game state and matchmaking
- Deployment: Docker containers on home server
- Exposure: Cloudflare tunnel

#### Front-end
- Framework: NextJS with static export
- WebSocket: Socket.IO client
- Animation: Framer Motion
- Hosting: GitHub Pages (static files)

### RNF02 - Observability

The system must implement comprehensive observability using:

#### Telemetry
- OpenTelemetry SDK for instrumentation
- Automatic instrumentation for HTTP, WebSocket, PostgreSQL, and Redis
- Custom metrics for game-specific operations (words submitted, game duration, active players)
- Prometheus for metrics storage and querying
- Metrics exposed on `/metrics` endpoint

#### Logging
- Structured JSON logging using Winston
- Loki for log aggregation and storage
- Log levels: error, warn, info, debug
- Context-rich logs including userId, gameId, and operation metadata
- Async logging to minimize performance impact

#### Tracing
- Distributed tracing via OpenTelemetry
- Tempo for trace storage
- Trace sampling: 100% for errors, 10% for successful requests
- Span context propagation across services

#### Visualization
- Grafana for unified dashboard
- Real-time monitoring of system health
- Alerting for critical metrics (error rates, latency, resource usage)

### RNF03 - Testing

#### Integration Testing
- Framework: Playwright with Testcontainers
- Real dependencies: PostgreSQL and Redis via Testcontainers
- Mock external services: Dictionary API
- Test coverage: Critical game flows (create → join → play → finish)
- CI/CD integration

#### Load Testing
- Tool: k6
- WebSocket load testing for matchmaking and game sessions
- Performance benchmarks for word validation
- Gradual load ramping to identify bottlenecks

#### E2E Testing
- Framework: Playwright
- Full user journeys from browser
- Test real-time interactions between multiple players
- Cross-browser testing (Chromium, Firefox, WebKit)

### RNF04 - Deployment

#### Infrastructure as Code
- Tool: OpenTofu (Terraform fork) with Docker provider
- Declarative infrastructure definition
- Version-controlled configuration
- State management and drift detection
- Deploy to home server via SSH

#### CI/CD
- Platform: GitHub Actions
- Automated testing on pull requests
- Automated deployment on merge to main
- SSH-based deployment to home server
- Build and push Docker images to GitHub Container Registry

#### Infrastructure Components
- Application containers (NestJS backend)
- PostgreSQL container with persistent volume
- Redis container with persistent volume
- Prometheus container for metrics
- Loki container for logs
- Tempo container for traces
- Grafana container for visualization
- Nginx/Caddy reverse proxy (managed by OpenTofu)
- Let's Encrypt SSL certificates

### RNF05 - Performance

#### Response Time
- Word validation: < 100ms p99
- Lobby creation: < 200ms p99
- WebSocket message delivery: < 50ms p95

#### Concurrency
- Support 100+ concurrent players
- Support 20+ concurrent games
- Redis-based locking for race conditions

#### Resource Usage
- Observability overhead: < 5% CPU impact
- Memory: < 512MB per backend instance
- Database connection pooling

#### Resource Limits (DoS Protection)
- All containers must have CPU limits to prevent resource exhaustion
- All containers must have memory limits to prevent OOM issues
- All containers must have disk space limits (storage driver quotas)
- Limits configured to protect home server from resource exhaustion attacks
- Rate limiting on API endpoints to prevent abuse
- WebSocket connection limits per IP to prevent DoS
- Maximum container resources:
  - Backend: 1 CPU core, 512MB RAM, 1GB disk
  - PostgreSQL: 1 CPU core, 512MB RAM, 10GB disk
  - Redis: 0.5 CPU cores, 256MB RAM, 1GB disk
  - Prometheus: 0.5 CPU cores, 512MB RAM, 5GB disk
  - Loki: 0.5 CPU cores, 512MB RAM, 5GB disk
  - Tempo: 0.5 CPU cores, 256MB RAM, 2GB disk
  - Grafana: 0.5 CPU cores, 256MB RAM, 1GB disk

### RNF06 - Security

#### Authentication
- Password hashing using bcrypt
- JWT tokens for session management
- Secure WebSocket connections

#### Infrastructure
- SSH key-based authentication (no passwords)
- Firewall: UFW with limited open ports
- SSL/TLS encryption via Cloudflare tunnel
- Secrets stored in GitHub Secrets (never in code)

#### Data Protection
- Database credentials via environment variables
- Redis authentication enabled
- No sensitive data in logs

### RNF07 - Reliability

#### Health Checks
- HTTP endpoint: `/health`
- Check database connectivity
- Check Redis connectivity
- Automatic container restart on failure

#### Data Persistence
- PostgreSQL with persistent volumes
- Redis with AOF persistence
- Regular database backups (manual)

#### Error Handling
- Graceful degradation on service failures
- User-friendly error messages
- Comprehensive error logging and alerting

### RNF08 - Maintainability

#### Code Quality
- TypeScript strict mode
- ESLint and Prettier
- Consistent coding standards
- Dependency injection (NestJS)

#### Documentation
- Setup and deployment instructions
- Observability dashboard documentation

#### Monitoring
- Real-time system health visibility
- Grafana dashboards for metrics, logs, and traces
- Alert notifications for critical issues


