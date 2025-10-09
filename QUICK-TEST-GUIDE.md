# Quick Testing Guide - OpenRoute Optimizer

## 🚀 5-Minute Quick Start

### 1. Prerequisites Check
```bash
# Verify installations
node --version  # Should be v18+
docker --version
git --version
```

### 2. Environment Setup
```bash
# Clone and setup
git clone <repository-url>
cd openroute-optimizer
npm install

# Start test environment
docker-compose up -d
```

### 3. Run Basic Tests
```bash
# Core functionality test (1 min)
npm test

# Visual verification (2 min)
npm run dev
# Open http://localhost:3000
# ✓ Map loads with sample vehicles
# ✓ Dashboard shows fleet data
# ✓ Optimization button works
```

## 🧪 Component Tests (Choose Your Focus)

### Core Algorithm Testing
```bash
# Test routing algorithms
cd packages/core
npm test

# Expected: ✓ A* pathfinding, ✓ VRP solver, ✓ Optimization techniques
```

### Web Interface Testing  
```bash
# Test React components
cd packages/web
npm test

# Visual testing
npm run storybook
# Open http://localhost:6006
```

### Real-Time Testing
```bash
# Test WebSocket functionality
npm run test:realtime

# Start GPS simulator
npm run start:gps-simulator
# ✓ Vehicle positions update
# ✓ Route deviations detected
```

## 🎯 Critical Path Testing

### 1. Route Optimization Flow
```bash
# Test optimization pipeline
curl -X POST http://localhost:8000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "vehicles": [{"id": "v1", "capacity": 1000}],
    "deliveries": [{"id": "d1", "position": [37.7749, -122.4194]}]
  }'

# Expected: HTTP 200, optimized routes returned
```

### 2. Real-Time Tracking Flow
```bash
# Test WebSocket connection
wscat -c ws://localhost:8081

# Send position update
{"type": "position_update", "vehicleId": "test1", "position": [37.7749, -122.4194]}

# Expected: Route updates, deviation alerts if applicable
```

### 3. Database Integration
```bash
# Test PostGIS functionality
npm run test:database

# Expected: ✓ Spatial queries, ✓ Distance calculations
```

## 🔍 Manual Testing Checklist

### Web Interface
- [ ] Map loads without errors
- [ ] Vehicles appear on map
- [ ] Routes are visualized correctly
- [ ] Dashboard shows live data
- [ ] Optimization controls work
- [ ] Real-time updates appear

### API Endpoints
- [ ] `/api/optimize` returns valid routes
- [ ] `/api/vehicles` returns fleet data
- [ ] `/api/tracking` accepts GPS updates
- [ ] WebSocket connections establish
- [ ] Authentication works (if enabled)

### Performance
- [ ] Page loads in <3 seconds
- [ ] Route optimization completes in <10 seconds
- [ ] Real-time updates have <1 second latency
- [ ] No memory leaks during extended use

## 🚨 Troubleshooting

### Common Issues

**Map not loading?**
```bash
# Check Leaflet assets
ls packages/web/public/leaflet/
# Should contain marker icons and CSS
```

**Database connection failed?**
```bash
# Restart PostgreSQL
docker-compose restart postgres
# Verify connection
npm run db:ping
```

**WebSocket connection refused?**
```bash
# Check if server is running
netstat -an | grep 8081
# Start WebSocket server
npm run start:ws-server
```

## 📊 Test Results Interpretation

### Success Indicators
- **Unit Tests**: >95% pass rate
- **Integration Tests**: All critical paths working
- **Performance**: Response times within targets
- **Visual Tests**: No regressions in UI
- **E2E Tests**: Complete user workflows functioning

### Performance Benchmarks
```
Route Optimization: <5 seconds (50 deliveries)
Map Rendering: <2 seconds (initial load)
WebSocket Latency: <500ms (position updates)
Database Queries: <100ms (spatial operations)
```

## 🔧 Advanced Testing

### Load Testing
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery run test-configs/load-test.yml

# Expected: <2s response time at 50 req/sec
```

### Mobile Testing
```bash
# Test responsive design
npm run test:mobile

# Manual mobile test
# Open DevTools → Device Mode
# Test on iPhone/Android viewports
```

### Cross-Browser Testing
```bash
# Automated browser testing
npm run test:browsers

# Manual testing checklist:
# ✓ Chrome, ✓ Firefox, ✓ Safari, ✓ Edge
```

## 🎯 Production Readiness Checklist

### Before Deployment
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security tests completed
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Backup/recovery procedures verified

### Monitoring Setup
- [ ] Application monitoring configured
- [ ] Database monitoring active
- [ ] Log aggregation working
- [ ] Alert thresholds set
- [ ] Health check endpoints responding

---

## 📞 Need Help?

**Quick Support:**
- Check logs: `docker-compose logs`
- Reset environment: `npm run reset:test-env`
- View test results: Open `test-results/index.html`

**Detailed troubleshooting**: See [TESTING.md](./TESTING.md)