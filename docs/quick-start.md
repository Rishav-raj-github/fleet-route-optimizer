# 🚀 Quick Start Guide

Get your Fleet Route Optimizer running in minutes with Docker + PostgreSQL + PostGIS!

## 📋 Prerequisites

- **Docker & Docker Compose** installed
- **8GB RAM** minimum 
- **Ports available**: 3001, 3002, 5432, 6379

## ⚡ Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/vkondepati/fleet-route-optimizer.git
cd fleet-route-optimizer
```

### 2. Start the Complete System
```bash
# Start PostgreSQL + PostGIS, Redis, and API server
docker-compose up -d

# Check all services are healthy
docker-compose ps
```

### 3. Initialize the Database
```bash
# The database initializes automatically with sample data
# Verify with:
docker-compose exec postgres psql -U postgres -d fleet_optimizer -c "SELECT name, ST_AsText(current_location) FROM vehicles;"
```

### 4. Access Your Application
- **🌐 Main Application**: http://localhost:3001
- **🏥 Health Check**: http://localhost:3001/health  
- **📚 API Documentation**: http://localhost:3001/docs

## 🎯 What You Get

### **Complete Fleet Management System**
- ✅ **PostgreSQL + PostGIS** spatial database
- ✅ **Redis** caching for high performance
- ✅ **Real-time WebSocket** fleet tracking
- ✅ **Interactive mapping** with Leaflet.js
- ✅ **Advanced VRP algorithms** (Clarke-Wright, A*, Genetic)

### **Sample Data Included**
- **3 Vehicles**: Truck, Van, Motorcycle (San Francisco locations)
- **3 Deliveries**: Real pickup/delivery coordinates  
- **PostGIS spatial indices** for fast geographic queries

## 🚛 Core Features

### **Route Optimization**
```javascript
// Optimize routes with PostGIS spatial calculations
POST /api/optimize
{
  "algorithm": "clarke-wright" // or "astar", "genetic", "advanced"
}
```

### **Fleet Management**
```javascript
// Add vehicles with geographic locations
POST /api/vehicles
{
  "name": "Truck-004",
  "vehicleType": "truck", 
  "capacity": 2000,
  "position": [37.7749, -122.4194],
  "driverName": "John Doe"
}
```

### **Delivery Management**
```javascript
// Add deliveries with PostGIS coordinates
POST /api/deliveries
{
  "address": "123 Market St, San Francisco",
  "position": [37.7849, -122.4094],
  "weight": 50,
  "priority": "high"
}
```

## 📊 Database Schema

### **Spatial Tables with PostGIS**
```sql
-- Vehicles with geographic locations
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    capacity_kg INTEGER NOT NULL,
    current_location GEOMETRY(POINT, 4326), -- PostGIS spatial column
    status VARCHAR(20) DEFAULT 'available',
    driver_name VARCHAR(100)
);

-- Deliveries with pickup/delivery coordinates
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    pickup_location GEOMETRY(POINT, 4326),    -- PostGIS spatial column
    delivery_location GEOMETRY(POINT, 4326),  -- PostGIS spatial column
    pickup_address TEXT,
    delivery_address TEXT NOT NULL,
    weight_kg DECIMAL(10,2) NOT NULL,
    priority INTEGER DEFAULT 1
);

-- Optimized routes storage
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id),
    route_data JSONB,
    optimization_algorithm VARCHAR(50),
    total_distance DECIMAL(10,2),
    total_duration INTEGER,
    status VARCHAR(20) DEFAULT 'planned'
);
```

## 🌐 API Endpoints

### **Fleet Operations**
- `GET /api/vehicles` - Get all vehicles from database
- `POST /api/vehicles` - Add vehicle with PostGIS location
- `GET /api/deliveries` - Get deliveries with spatial data
- `POST /api/deliveries` - Add delivery with coordinates
- `GET /api/fleet/stats` - Fleet statistics with spatial analysis

### **Route Optimization**
- `POST /api/optimize` - VRP optimization with PostGIS calculations
- `GET /health` - System health with database status

### **Real-time Updates**
- WebSocket: `ws://localhost:3002` - Live fleet tracking

## 🎮 Interactive Usage

### **Using the Web Interface**
1. **View Fleet Map**: See vehicles and deliveries on interactive map
2. **Add Vehicles**: Use the form to add vehicles to PostgreSQL database
3. **Click to Add Deliveries**: Click map locations to add new deliveries
4. **Optimize Routes**: Choose algorithm and run spatial optimization
5. **Real-time Updates**: See live fleet status via WebSocket

### **Algorithm Selection**
- **Clarke-Wright Savings**: Classic VRP algorithm, fast and efficient
- **A* Pathfinding**: Advanced pathfinding with obstacles
- **Genetic Algorithm**: Evolutionary optimization for complex routes
- **Multi-Objective**: Balances distance, time, and resource constraints

## 🔧 Configuration

### **Environment Variables**
```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=fleet_optimizer
DB_USER=postgres
DB_PASSWORD=fleet123

# Redis Configuration  
REDIS_HOST=redis
REDIS_PORT=6379

# API Configuration
API_PORT=3001
WS_PORT=3002
NODE_ENV=production
```

### **Docker Services**
```yaml
services:
  postgres:    # PostgreSQL 15 + PostGIS 3.3
  redis:       # Redis 7 for caching
  api:         # Node.js API server
  web:         # Frontend application
```

## 📈 Performance Features

### **PostGIS Spatial Optimizations**
- **Spatial Indices**: GIST indices on all geographic columns
- **Geographic Calculations**: Accurate distance with `ST_Distance`
- **Spatial Queries**: Fast geographic filtering and analysis

### **Redis Caching**
- **Route Cache**: Optimization results cached for 1 hour
- **Fleet Status**: Real-time data caching
- **API Response**: Cached database queries

## 🐛 Troubleshooting

### **Common Issues**

**Port Already in Use**
```bash
# Check what's using ports
docker-compose down
sudo lsof -i :3001 :3002 :5432 :6379
```

**Database Connection Failed**
```bash
# Check PostgreSQL health
docker-compose exec postgres pg_isready -U postgres
```

**Missing Dependencies**
```bash
# Rebuild containers
docker-compose down
docker-compose up --build
```

### **Health Checks**
```bash
# Verify all services
curl http://localhost:3001/health

# Check database schema
docker-compose exec postgres psql -U postgres -d fleet_optimizer -c "\dt"

# Test spatial queries
docker-compose exec postgres psql -U postgres -d fleet_optimizer -c "SELECT PostGIS_Version();"
```

## 🚀 Advanced Usage

### **Custom Algorithms**
Extend the VRP solver with your own optimization algorithms:
```javascript
// Add custom algorithm in openroute-vrp.ts
class CustomVRPSolver extends VRPSolver {
  solveCustomAlgorithm(instance) {
    // Your optimization logic with PostGIS integration
    return optimizedSolution;
  }
}
```

### **Spatial Queries**
Leverage PostGIS for advanced spatial analysis:
```sql
-- Find vehicles within 5km radius
SELECT name FROM vehicles 
WHERE ST_DWithin(current_location::geography, ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326)::geography, 5000);

-- Calculate route distances
SELECT ST_Distance(pickup_location::geography, delivery_location::geography) / 1000 as distance_km 
FROM deliveries;
```

## 📚 Further Reading

- [API Documentation](http://localhost:3001/docs)
- [Docker Compose Reference](docker-compose.yml)
- [Database Schema](scripts/init-db.sql)
- [VRP Algorithms](openroute-vrp.ts)
- [PostGIS Documentation](https://postgis.net/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to optimize your fleet?** ⭐ Star this repo and get started today!

🚛 **Happy Fleet Optimizing!** 📍🗺️