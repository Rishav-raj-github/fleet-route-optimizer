# Fleet Route Optimizer

**Working fork and personal research project for vehicle routing optimization, real-time tracking, and logistics planning.**

[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD--2--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

## About This Fork

This is my personal fork of the Leaflet-based Fleet Route Optimizer platform, originally created by the open-source community. I use this project for:

- **VRP Algorithm Experimentation**: Testing Clarke-Wright, Genetic Algorithms, and custom heuristics for vehicle routing
- **India-Focused Logistics**: Adapting routing constraints for Indian urban networks, traffic patterns, and delivery scenarios
- **Real-Time Tracking & Optimization**: Building live fleet management systems with WebSocket-based vehicle tracking
- **Logistics Automation Research**: ML-driven demand prediction and dynamic route optimization

### Credits
Core mapping architecture, Docker setup, and build system inherited from the upstream [Leaflet/Fleet Route Optimizer project](https://github.com/vkondepati/fleet-route-optimizer). See [UPSTREAM.md](#) for full upstream credits and [LICENSE](./LICENSE) for BSD-2-Clause terms.

---

## Key Features

### Advanced Route Optimization
- A* pathfinding with geographic heuristics for road networks
- Vehicle Routing Problem (VRP) solvers:
  - Clarke-Wright savings algorithm
  - Genetic algorithm with local search
  - Ant colony optimization (experimental)
- Multi-objective optimization: distance, time, fuel cost, delivery windows
- Vehicle constraints: capacity, time windows, vehicle types, vehicle-specific costs

### Real-Time GPS Tracking & Fleet Management
- Live vehicle location updates via WebSocket
- Route deviation detection and automatic re-routing
- Predictive ETA calculation with traffic integration
- Emergency response for breakdowns/incidents
- Interactive Leaflet-based map with vehicle status visualization

### Modern Web Dashboard
- React + Material-UI responsive interface
- Real-time fleet monitoring with live metrics
- Route visualization with turn-by-turn directions
- Driver communication and alerts
- Performance analytics and cost tracking

### Production-Ready Architecture
- Docker containerization (API, web, database)
- PostgreSQL + PostGIS for spatial queries
- Redis caching for high-throughput optimization
- Node.js/Express API with comprehensive test suite
- GitHub Actions CI/CD pipeline

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone this fork
git clone https://github.com/Rishav-raj-github/fleet-route-optimizer.git
cd fleet-route-optimizer

# Start all services
docker-compose up -d

# Access the dashboard
open http://localhost:3000
```

### Option 2: Local Development

**Prerequisites**: Node.js 18+, PostgreSQL 13+, Redis 6+

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run db:setup

# Start development servers
npm run dev
```

See [LOCAL-DEVELOPMENT-GUIDE.md](./LOCAL-DEVELOPMENT-GUIDE.md) for detailed setup.

---

## Project Structure

```
.
├── src/                          # Core application code
│   ├── openroute-vrp.ts         # VRP optimization engine
│   ├── openroute-astar.ts       # A* pathfinding algorithm
│   ├── openroute-realtime-tracker.ts  # GPS tracking system
│   ├── openroute-fleet-manager.ts     # Multi-vehicle coordination
│   └── openroute-types.ts       # TypeScript type definitions
├── real-time-tracking-component.tsx   # React dashboard component
├── docs/                         # Documentation
├── tests/                        # Test suite (unit, integration, e2e)
├── docker-compose.yml           # Development environment
└── README.md                    # This file
```

---

## Architecture

```
┌──────────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│  React Dashboard     │  │  Node.js API     │  │  PostgreSQL +   │
│  (Leaflet Maps)      │◄─►  (Express.js)    │◄─►  PostGIS       │
└──────────────────────┘  └──────────────────┘  └─────────────────┘
         │                       │                      │
         │                       │                      │
         └───────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼───────────┐
                    │   Redis Cache          │
                    │   (VRP Solutions,      │
                    │    Route Cache)        │
                    └────────────────────────┘
```

### Data Flow
1. Dashboard sends optimization request (orders, vehicle constraints, objectives)
2. API processes request using VRP solver from `openroute-vrp.ts`
3. A* pathfinding engine (`openroute-astar.ts`) computes road-based routes
4. Results cached in Redis for subsequent queries
5. Dashboard visualizes optimized routes on interactive map
6. WebSocket connection streams live vehicle updates via real-time tracker

---

## Testing

Comprehensive test coverage across all modules:

```bash
# Run all tests
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Performance benchmarks
npm run test:performance
```

See [TESTING.md](./TESTING.md) for test organization and custom test guides.

---

## Documentation

- **[LOCAL-DEVELOPMENT-GUIDE.md](./LOCAL-DEVELOPMENT-GUIDE.md)** – Setup development environment
- **[QUICK-TEST-GUIDE.md](./QUICK-TEST-GUIDE.md)** – Run tests in 5 minutes
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** – Code style, commit conventions, roadmap
- **[TESTING.md](./TESTING.md)** – Test structure and best practices
- **[docs/deployment.md](./docs/deployment.md)** – Production deployment
- **[FAQ.md](./FAQ.md)** – Common questions and troubleshooting

---

## Development Roadmap (2026)

**Current Focus:**
- [ ] Optimize VRP solver for 500+ stop routes
- [ ] Add India-specific traffic models and road networks
- [ ] ML-driven demand prediction for anticipatory optimization
- [ ] Multi-day route planning with vehicle maintenance windows

**Medium-term:**
- [ ] EV vehicle support with battery management
- [ ] Mobile app for driver notifications
- [ ] Integration with Google Maps & MapBox APIs
- [ ] Customer communication automation (SMS/email ETAs)
- [ ] Advanced analytics and cost tracking dashboards

**Long-term:**
- [ ] SaaS multi-tenant platform deployment
- [ ] Integration with logistics APIs (Flexport, Shippo, etc.)
- [ ] Autonomous vehicle simulation and routing
- [ ] Global network optimization for enterprises

---

## Contributing

Contributions welcome! This project is actively maintained for:

- **Algorithm Research** – New VRP solvers, heuristics, metaheuristics
- **Frontend Development** – Dashboard UX/UI improvements, mobile support
- **DevOps & Infrastructure** – Deployment, monitoring, scaling
- **Data Science** – Traffic prediction, demand forecasting, cost modeling

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines, code style, and pull request process.

---

## License

BSD-2-Clause License – see [LICENSE](./LICENSE) for details.

This project builds on open-source work; proper attribution is maintained for all upstream contributions.

---

## Support & Community

- **Issues** – [GitHub Issues](https://github.com/Rishav-raj-github/fleet-route-optimizer/issues)
- **Discussions** – [GitHub Discussions](https://github.com/Rishav-raj-github/fleet-route-optimizer/discussions)
- **Wiki** – [Project Wiki](https://github.com/Rishav-raj-github/fleet-route-optimizer/wiki)

---

## Acknowledgments

- Leaflet.js for mapping infrastructure
- Vehicle Routing Problem research community
- Original upstream contributors at [vkondepati/fleet-route-optimizer](https://github.com/vkondepati/fleet-route-optimizer)
- PostgreSQL + PostGIS for spatial data capabilities

**Ready to optimize routes?** Start with the [Quick Start](#quick-start) or [LOCAL-DEVELOPMENT-GUIDE.md](./LOCAL-DEVELOPMENT-GUIDE.md).
