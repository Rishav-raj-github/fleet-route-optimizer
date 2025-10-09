# OpenRoute Optimizer - Comprehensive Testing Guide

This guide provides detailed testing instructions for all components of the OpenRoute Optimizer platform, including unit testing, integration testing, performance testing, and end-to-end testing.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start Testing](#quick-start-testing)
3. [Component Testing](#component-testing)
4. [Integration Testing](#integration-testing)
5. [Performance Testing](#performance-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Real-Time Testing](#real-time-testing)
8. [API Testing](#api-testing)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Software Requirements
- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **PostgreSQL** (v14 or higher) with PostGIS extension
- **Redis** (v6 or higher)
- **Git**

### Testing Tools Installation
```bash
# Install testing frameworks globally
npm install -g jest cypress artillery mocha

# Install Docker containers for testing
docker pull postgres:14-alpine
docker pull redis:6-alpine
docker pull nginx:alpine
```

### Environment Setup
```bash
# Clone the repository
git clone https://github.com/your-org/openroute-optimizer.git
cd openroute-optimizer

# Copy environment files
cp .env.example .env.test
cp packages/web/.env.example packages/web/.env.test

# Install dependencies
npm install
cd packages/web && npm install
cd ../core && npm install
cd ../..
```

## Quick Start Testing

### 1. Run All Tests (5 minutes)
```bash
# Run complete test suite
npm run test:all

# Expected output:
# ✓ Core algorithms tests (32 tests)
# ✓ Web interface tests (18 tests) 
# ✓ Real-time tracking tests (12 tests)
# ✓ Integration tests (8 tests)
# Total: 70 tests passing
```

### 2. Visual Smoke Test (2 minutes)
```bash
# Start development environment
docker-compose up -d
npm run dev

# Open browser to http://localhost:3000
# Verify: Map loads, sample vehicles appear, dashboard shows data
```

## Component Testing

### Core Algorithms Testing

#### A* Pathfinding Algorithm
```bash
cd packages/core
npm test astar

# Manual test script
node test-scripts/test-astar.js
```

**Test Cases:**
```javascript
// Test case 1: Basic pathfinding
const start = [37.7749, -122.4194] // San Francisco
const goal = [37.7849, -122.4094]  // 1km north
const result = astar.findPath(start, goal)

// Expected: Route with 3-5 segments, total distance ~1.1km
// Verify: result.length > 0, total distance within 10% of direct distance

// Test case 2: Vehicle constraints
const truck = { id: 'truck1', restrictions: { maxWeight: 5000 } }
const constrainedResult = astar.findPath(start, goal, truck)

// Expected: Route avoids weight-restricted roads
// Verify: No segments exceed vehicle weight limits
```

#### VRP Solver Testing
```bash
# Run VRP test suite
npm test vrp

# Performance test
npm run test:vrp-performance
```

**Test Scenarios:**
```javascript
// Scenario 1: Small fleet (3 vehicles, 10 deliveries)
const smallProblem = {
  vehicles: createTestVehicles(3),
  deliveries: createTestDeliveries(10),
  depot: [37.7749, -122.4194]
}

// Expected results:
// - All deliveries assigned
// - No capacity violations
// - Solution time < 1 second

// Scenario 2: Large fleet (20 vehicles, 200 deliveries)
const largeProblem = createLargeProblem()
// Expected: Solution within 30 seconds, efficiency > 85%
```

#### Route Optimization Testing
```bash
# Test optimization techniques
npm test optimization-techniques

# Benchmark different algorithms
npm run benchmark:algorithms
```

### Web Interface Testing

#### React Component Testing
```bash
cd packages/web
npm test

# Run specific component tests
npm test MapContainer
npm test Dashboard
npm test RealTimeTracking
```

**Component Test Examples:**
```javascript
// MapContainer.test.tsx
import { render, screen } from '@testing-library/react'
import { MapContainer } from '../components/MapContainer'

test('renders map with vehicles', () => {
  const vehicles = [
    { id: '1', position: [37.7749, -122.4194], status: 'active' }
  ]
  
  render(<MapContainer vehicles={vehicles} />)
  
  // Verify map container exists
  expect(screen.getByRole('application')).toBeInTheDocument()
  
  // Verify vehicle markers
  expect(screen.getByText('Vehicle 001')).toBeInTheDocument()
})
```

#### Visual Regression Testing
```bash
# Install visual testing tools
npm install -D @storybook/test-runner chromatic

# Run visual tests
npm run test:visual

# Update snapshots if needed
npm run test:visual -- --updateSnapshot
```

### Real-Time Tracking Testing

#### WebSocket Connection Testing
```bash
# Start test WebSocket server
npm run start:test-ws-server

# Run real-time tests
npm test realtime-tracker
```

**WebSocket Test Script:**
```javascript
// Test real-time connection
const tracker = new RealTimeTracker('ws://localhost:8081')

// Test 1: Connection establishment
await tracker.connect()
expect(tracker.isConnected()).toBe(true)

// Test 2: Vehicle position updates
tracker.subscribeToVehicle('vehicle_1')
const positionUpdate = await waitForMessage('position_update')
expect(positionUpdate.vehicleId).toBe('vehicle_1')

// Test 3: Route deviation detection
tracker.updateVehiclePosition('vehicle_1', [37.8000, -122.4000])
const deviation = await waitForMessage('route_deviation')
expect(deviation.deviationType).toBe('off_route')
```

## Integration Testing

### API Integration Testing
```bash
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Run API tests
npm run test:api
```

**API Test Suite:**
```bash
# Test route optimization API
curl -X POST http://localhost:8000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "vehicles": [{"id": "v1", "capacity": 1000}],
    "deliveries": [{"id": "d1", "position": [37.7749, -122.4194]}]
  }'

# Expected: HTTP 200, optimized routes in response
```

### Database Integration Testing
```bash
# Test PostGIS functionality
npm run test:database

# Test Redis caching
npm run test:cache
```

**Database Test Examples:**
```sql
-- Test PostGIS distance calculations
SELECT ST_Distance(
  ST_Point(-122.4194, 37.7749),
  ST_Point(-122.4094, 37.7849)
) as distance;

-- Expected: Distance approximately 0.011 degrees
-- Test should verify result within acceptable range
```

## Performance Testing

### Load Testing with Artillery
```bash
# Install Artillery
npm install -g artillery

# Run load tests
artillery run test-configs/load-test.yml
```

**Load Test Configuration:**
```yaml
# load-test.yml
config:
  target: 'http://localhost:8000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Load test"
  defaults:
    headers:
      Authorization: 'Bearer test-token'

scenarios:
  - name: "Route optimization"
    weight: 70
    flow:
      - post:
          url: "/api/optimize"
          json:
            vehicles: [{"id": "v1", "capacity": 1000}]
            deliveries: [{"id": "d1", "position": [37.7749, -122.4194]}]
      - think: 2

  - name: "Real-time updates"
    weight: 30
    flow:
      - get:
          url: "/api/vehicles/v1/position"
      - think: 1
```

### Algorithm Performance Testing
```bash
# Benchmark routing algorithms
npm run benchmark:routing

# Expected results:
# - Dijkstra: <100ms for 1000 nodes
# - A*: <50ms for 1000 nodes  
# - VRP Clarke-Wright: <5s for 50 deliveries
# - VRP Genetic: <30s for 100 deliveries
```

### Memory and CPU Testing
```bash
# Profile memory usage
npm run profile:memory

# Monitor CPU usage during optimization
npm run profile:cpu

# Expected: Memory usage <1GB, CPU <80% during normal operation
```

## End-to-End Testing

### Cypress E2E Testing
```bash
# Install Cypress
cd packages/web
npm install -D cypress

# Open Cypress GUI
npx cypress open

# Run headless tests
npx cypress run
```

**E2E Test Scenarios:**
```javascript
// cypress/e2e/route-optimization.cy.js
describe('Route Optimization Workflow', () => {
  it('should complete full optimization cycle', () => {
    // 1. Visit application
    cy.visit('http://localhost:3000')
    
    // 2. Wait for map to load
    cy.get('[data-testid="map-container"]').should('be.visible')
    
    // 3. Add vehicles
    cy.get('[data-testid="add-vehicle-btn"]').click()
    cy.get('[data-testid="vehicle-form"]').within(() => {
      cy.get('input[name="name"]').type('Test Vehicle 001')
      cy.get('input[name="capacity"]').type('1000')
      cy.get('button[type="submit"]').click()
    })
    
    // 4. Add deliveries
    cy.get('[data-testid="add-delivery-btn"]').click()
    cy.get('[data-testid="delivery-form"]').within(() => {
      cy.get('input[name="address"]').type('123 Test St, San Francisco')
      cy.get('button[type="submit"]').click()
    })
    
    // 5. Run optimization
    cy.get('[data-testid="optimize-btn"]').click()
    
    // 6. Verify results
    cy.get('[data-testid="optimization-results"]', { timeout: 10000 })
      .should('contain', 'Route optimized')
    
    // 7. Verify map shows route
    cy.get('[data-testid="route-polyline"]').should('be.visible')
    
    // 8. Start real-time tracking
    cy.get('[data-testid="start-tracking-btn"]').click()
    
    // 9. Verify real-time updates
    cy.get('[data-testid="vehicle-status"]')
      .should('contain', 'Active')
  })
})
```

### User Journey Testing
```javascript
// Test complete user workflows
describe('User Journey: Fleet Manager', () => {
  it('should manage fleet operations', () => {
    // Login workflow
    cy.login('fleet-manager@test.com', 'password')
    
    // Dashboard overview
    cy.get('[data-testid="fleet-overview"]')
      .should('contain', 'Total Vehicles: 0')
    
    // Add multiple vehicles
    cy.addVehicle('Truck 001', 'truck', 2000)
    cy.addVehicle('Van 001', 'van', 1000)
    
    // Create delivery batch
    cy.createDeliveryBatch([
      { address: '123 Main St', weight: 500 },
      { address: '456 Oak Ave', weight: 300 },
      { address: '789 Pine Rd', weight: 700 }
    ])
    
    // Run optimization
    cy.get('[data-testid="optimize-all-btn"]').click()
    
    // Verify optimization results
    cy.get('[data-testid="optimization-summary"]')
      .should('contain', 'Routes created: 2')
      .should('contain', 'Total distance:')
      .should('contain', 'Estimated time:')
    
    // Start fleet tracking
    cy.get('[data-testid="start-fleet-tracking"]').click()
    
    // Monitor real-time updates
    cy.get('[data-testid="real-time-status"]')
      .should('contain', 'Connected')
    
    // Simulate vehicle positions
    cy.simulateVehicleMovement('truck-001', [
      [37.7749, -122.4194],
      [37.7759, -122.4184],
      [37.7769, -122.4174]
    ])
    
    // Verify tracking updates
    cy.get('[data-testid="vehicle-truck-001"]')
      .should('contain', 'Moving')
      .should('contain', 'On Route')
  })
})
```

## Real-Time Testing

### WebSocket Load Testing
```bash
# Test WebSocket scalability
npm run test:websocket-load

# Test with Artillery WebSocket plugin
artillery run test-configs/websocket-load.yml
```

**WebSocket Load Test:**
```yaml
# websocket-load.yml
config:
  target: 'ws://localhost:8081'
  phases:
    - duration: 60
      arrivalRate: 10
  plugins:
    ws: {}

scenarios:
  - name: "Vehicle tracking simulation"
    engine: ws
    flow:
      - connect:
          url: "/realtime"
      - send:
          payload: |
            {
              "type": "subscribe",
              "channel": "vehicle_positions",
              "vehicleId": "vehicle_{{ $uuid }}"
            }
      - loop:
        - send:
            payload: |
              {
                "type": "position_update",
                "vehicleId": "vehicle_{{ $uuid }}",
                "position": [{{ $randomFloat(37.7, 37.8) }}, {{ $randomFloat(-122.5, -122.3) }}],
                "timestamp": "{{ $timestamp }}"
              }
        - think: 5
        count: 20
```

### GPS Simulation Testing
```bash
# Start GPS simulator
npm run start:gps-simulator

# Run GPS accuracy tests
npm run test:gps-accuracy
```

**GPS Test Scenarios:**
```javascript
// Test GPS accuracy and route adherence
const gpsSimulator = new GPSSimulator()

// Scenario 1: Normal driving
const route = [
  [37.7749, -122.4194],
  [37.7849, -122.4094],
  [37.7949, -122.3994]
]

gpsSimulator.simulateRoute('vehicle_1', route, {
  speed: 50, // km/h
  accuracy: 5, // meters
  updateInterval: 10 // seconds
})

// Verify: Position updates within accuracy bounds
// Verify: Speed calculations are correct
// Verify: Route progress tracking works

// Scenario 2: Route deviation
gpsSimulator.simulateDeviation('vehicle_1', {
  deviationDistance: 200, // meters off route
  duration: 300 // seconds
})

// Expected: Deviation alert triggered
// Expected: Route recalculation initiated
```

## API Testing

### REST API Testing with Postman/Newman
```bash
# Install Newman (Postman CLI)
npm install -g newman

# Run API test collection
newman run test-collections/openroute-api.postman_collection.json \
  --environment test-collections/test-environment.json \
  --reporters cli,html \
  --reporter-html-export test-results/api-report.html
```

**API Test Collection Structure:**
```json
{
  "name": "OpenRoute Optimizer API Tests",
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login with valid credentials",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"test@example.com\",\"password\":\"testpass\"}"
            }
          },
          "test": "pm.test('Login successful', () => { pm.response.to.have.status(200) })"
        }
      ]
    },
    {
      "name": "Route Optimization",
      "item": [
        {
          "name": "Optimize routes with valid data",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/optimize",
            "body": {
              "mode": "raw", 
              "raw": "{\"vehicles\":[{\"id\":\"v1\",\"capacity\":1000}],\"deliveries\":[{\"id\":\"d1\",\"position\":[37.7749,-122.4194]}]}"
            }
          },
          "test": "pm.test('Optimization successful', () => { pm.response.to.have.status(200); const json = pm.response.json(); pm.expect(json.routes).to.be.an('array') })"
        }
      ]
    }
  ]
}
```

### GraphQL API Testing
```bash
# Install GraphQL testing tools
npm install -D graphql-request @testing-library/jest-dom

# Run GraphQL tests
npm run test:graphql
```

**GraphQL Test Examples:**
```javascript
// Test GraphQL queries
import { request } from 'graphql-request'

const endpoint = 'http://localhost:8000/graphql'

test('should fetch vehicle data', async () => {
  const query = `
    query GetVehicles($status: VehicleStatus) {
      vehicles(status: $status) {
        id
        name
        position
        status
        currentRoute {
          id
          totalDistance
        }
      }
    }
  `
  
  const variables = { status: 'ACTIVE' }
  const data = await request(endpoint, query, variables)
  
  expect(data.vehicles).toHaveLength(3)
  expect(data.vehicles[0]).toHaveProperty('id')
  expect(data.vehicles[0]).toHaveProperty('currentRoute')
})
```

## Mobile Testing

### Responsive Design Testing
```bash
# Test mobile layouts
npm run test:mobile-layouts

# Visual regression testing for mobile
npm run test:visual -- --mobile
```

**Mobile Test Configuration:**
```javascript
// cypress/support/commands.js
Cypress.Commands.add('testMobileLayout', (deviceType) => {
  const devices = {
    'iphone-x': [375, 812],
    'android': [360, 640],
    'tablet': [768, 1024]
  }
  
  cy.viewport(...devices[deviceType])
  
  // Test mobile navigation
  cy.get('[data-testid="mobile-menu-button"]').should('be.visible')
  cy.get('[data-testid="desktop-nav"]').should('not.be.visible')
  
  // Test map responsiveness
  cy.get('[data-testid="map-container"]')
    .should('have.css', 'width')
    .and('match', /375px|360px|768px/)
})
```

## Performance Benchmarking

### Algorithm Performance Tests
```bash
# Run performance benchmarks
npm run benchmark

# Generate performance report
npm run benchmark:report
```

**Benchmark Test Suite:**
```javascript
// benchmark/routing-algorithms.js
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()

// A* vs Dijkstra comparison
suite
  .add('A* Algorithm (100 nodes)', () => {
    astar.findPath(startNode, endNode, graph100)
  })
  .add('Dijkstra Algorithm (100 nodes)', () => {
    dijkstra.findPath(startNode, endNode, graph100)
  })
  .add('A* Algorithm (1000 nodes)', () => {
    astar.findPath(startNode, endNode, graph1000)
  })
  .add('Dijkstra Algorithm (1000 nodes)', () => {
    dijkstra.findPath(startNode, endNode, graph1000)
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })

// Expected results:
// A* Algorithm (100 nodes) x 1,234 ops/sec ±1.23%
// Dijkstra Algorithm (100 nodes) x 987 ops/sec ±2.45%
// A* should be 20-30% faster than Dijkstra
```

## Troubleshooting

### Common Test Issues

#### 1. WebSocket Connection Failures
```bash
# Check if WebSocket server is running
netstat -an | grep 8081

# Start WebSocket server manually
npm run start:ws-server

# Test connection with wscat
npm install -g wscat
wscat -c ws://localhost:8081
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
docker ps | grep postgres

# Reset test database
npm run db:reset:test

# Verify PostGIS extension
psql -h localhost -U test_user test_db -c "SELECT PostGIS_Version();"
```

#### 3. Map Not Loading in Tests
```javascript
// Mock Leaflet in tests
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    addTo: jest.fn()
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn()
  }))
}))
```

#### 4. Slow Test Performance
```bash
# Run tests in parallel
npm test -- --maxWorkers=4

# Run only changed files
npm test -- --onlyChanged

# Skip slow integration tests
npm test -- --testPathIgnorePatterns=integration
```

### Test Data Management

#### Reset Test Environment
```bash
# Complete environment reset
docker-compose down -v
docker-compose up -d
npm run db:seed:test
```

#### Generate Test Data
```bash
# Create large dataset for performance testing
npm run generate:test-data -- --vehicles=100 --deliveries=1000

# Create specific test scenarios
npm run generate:test-scenarios
```

### Test Report Generation

#### Generate Comprehensive Report
```bash
# Run all tests with coverage
npm run test:coverage

# Generate HTML report
npm run test:report

# Output location: test-results/index.html
```

#### Continuous Integration
```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14-alpine
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:6-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:ci
        env:
          DATABASE_URL: postgres://postgres:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379
          
      - name: Upload coverage
        uses: codecov/codecov-action@v1
```

---

## Test Execution Summary

Execute this complete test suite to ensure platform reliability:

1. **Unit Tests**: `npm run test:unit` (2 minutes)
2. **Integration Tests**: `npm run test:integration` (5 minutes)  
3. **E2E Tests**: `npm run test:e2e` (10 minutes)
4. **Performance Tests**: `npm run test:performance` (15 minutes)
5. **Load Tests**: `npm run test:load` (20 minutes)

**Total Testing Time**: ~52 minutes for complete validation

**Success Criteria**:
- ✅ 95%+ test coverage
- ✅ All critical paths tested
- ✅ Performance within benchmarks
- ✅ Real-time features validated
- ✅ Cross-browser compatibility confirmed