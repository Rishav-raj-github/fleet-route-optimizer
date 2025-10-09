// Example test files for the OpenRoute Optimizer platform

// packages/core/tests/astar.test.js
import { AStarPathfinder } from '../src/algorithms/AStar'

describe('A* Pathfinding Algorithm', () => {
  let astar
  let mockRoadNetwork
  
  beforeEach(() => {
    mockRoadNetwork = {
      getNeighbors: jest.fn((nodeId) => [
        {
          id: 'neighbor1',
          position: [37.7749, -122.4194],
          distance: 1.0,
          roadType: 'arterial'
        }
      ])
    }
    astar = new AStarPathfinder(mockRoadNetwork)
  })
  
  test('should find path between two points', () => {
    const start = [37.7749, -122.4194]
    const goal = [37.7849, -122.4094]
    
    const result = astar.findPath(start, goal)
    
    expect(result).toHaveLength(greaterThan(0))
    expect(result[0].start).toEqual(start)
    expect(result[result.length - 1].end).toEqual(goal)
  })
  
  test('should respect vehicle constraints', () => {
    const vehicle = {
      id: 'truck1',
      restrictions: { maxWeight: 5000 }
    }
    
    const start = [37.7749, -122.4194]
    const goal = [37.7849, -122.4094]
    
    const result = astar.findPath(start, goal, vehicle)
    
    expect(mockRoadNetwork.getNeighbors).toHaveBeenCalledWith(
      expect.any(String),
      vehicle
    )
  })
  
  test('should throw error when no path exists', () => {
    mockRoadNetwork.getNeighbors.mockReturnValue([])
    
    const start = [37.7749, -122.4194]
    const goal = [37.7849, -122.4094]
    
    expect(() => {
      astar.findPath(start, goal)
    }).toThrow('No path found between start and goal')
  })
})

// packages/core/tests/vrp-solver.test.js
import { VRPSolver } from '../src/algorithms/VRP'

describe('VRP Solver', () => {
  let vrpSolver
  let testInstance
  
  beforeEach(() => {
    vrpSolver = new VRPSolver()
    testInstance = {
      depot: [37.7749, -122.4194],
      vehicles: [
        { id: 'v1', capacity: 1000, status: 'active' },
        { id: 'v2', capacity: 1500, status: 'active' }
      ],
      deliveries: [
        { id: 'd1', position: [37.7849, -122.4094], weight: 300 },
        { id: 'd2', position: [37.7949, -122.3994], weight: 500 },
        { id: 'd3', position: [37.8049, -122.3894], weight: 200 }
      ],
      distanceMatrix: [
        [0, 1.0, 2.0, 3.0],
        [1.0, 0, 1.0, 2.0],
        [2.0, 1.0, 0, 1.0],
        [3.0, 2.0, 1.0, 0]
      ],
      timeMatrix: [
        [0, 2, 4, 6],
        [2, 0, 2, 4],
        [4, 2, 0, 2],
        [6, 4, 2, 0]
      ],
      constraints: {
        capacityConstraints: true,
        timeWindowConstraints: false
      }
    }
  })
  
  test('Clarke-Wright should solve basic VRP', () => {
    const solution = vrpSolver.solveClarkeWright(testInstance)
    
    expect(solution.feasible).toBe(true)
    expect(solution.routes).toHaveLength(greaterThan(0))
    expect(solution.computationTime).toBeGreaterThan(0)
    
    // Verify all deliveries are assigned
    const assignedDeliveries = solution.routes.flatMap(r => r.sequence)
    expect(assignedDeliveries).toHaveLength(3)
    expect(assignedDeliveries).toContain('d1')
    expect(assignedDeliveries).toContain('d2')
    expect(assignedDeliveries).toContain('d3')
  })
  
  test('should respect capacity constraints', () => {
    // Create instance where one vehicle can't handle all deliveries
    testInstance.vehicles = [{ id: 'v1', capacity: 600, status: 'active' }]
    
    const solution = vrpSolver.solveClarkeWright(testInstance)
    
    solution.routes.forEach(route => {
      expect(route.load).toBeLessThanOrEqual(600)
    })
  })
  
  test('Genetic algorithm should improve solution quality', () => {
    const clarkeWrightSolution = vrpSolver.solveClarkeWright(testInstance)
    const geneticSolution = vrpSolver.solveGenetic(testInstance, {
      populationSize: 20,
      generations: 50
    })
    
    expect(geneticSolution.feasible).toBe(true)
    // Genetic should be equal or better
    expect(geneticSolution.objectiveValue).toBeLessThanOrEqual(
      clarkeWrightSolution.objectiveValue * 1.1 // Allow 10% tolerance
    )
  })
})

// packages/web/tests/MapContainer.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MapContainer } from '../src/components/MapContainer'

describe('MapContainer Component', () => {
  const mockVehicles = [
    {
      id: '1',
      name: 'Vehicle 001',
      position: [37.7749, -122.4194],
      status: 'active'
    },
    {
      id: '2',
      name: 'Vehicle 002',
      position: [37.7849, -122.4094],
      status: 'idle'
    }
  ]
  
  const mockRoutes = [
    {
      id: '1',
      name: 'Downtown Route',
      coordinates: [
        [37.7749, -122.4194],
        [37.7849, -122.4094]
      ],
      distance: 1.5,
      duration: 3,
      status: 'active'
    }
  ]
  
  beforeEach(() => {
    // Reset Leaflet mocks
    jest.clearAllMocks()
  })
  
  test('renders map container', () => {
    render(<MapContainer />)
    
    expect(L.map).toHaveBeenCalled()
    expect(L.tileLayer).toHaveBeenCalledWith(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      expect.objectContaining({
        attribution: '© OpenStreetMap contributors'
      })
    )
  })
  
  test('displays vehicles on map', () => {
    render(<MapContainer vehicles={mockVehicles} />)
    
    // Should create markers for each vehicle
    expect(L.marker).toHaveBeenCalledTimes(2)
    expect(L.marker).toHaveBeenCalledWith([37.7749, -122.4194], expect.any(Object))
    expect(L.marker).toHaveBeenCalledWith([37.7849, -122.4094], expect.any(Object))
  })
  
  test('displays routes on map', () => {
    render(<MapContainer routes={mockRoutes} />)
    
    expect(L.polyline).toHaveBeenCalledWith(
      [[37.7749, -122.4194], [37.7849, -122.4094]],
      expect.objectContaining({
        color: '#4caf50', // Active route color
        weight: 4
      })
    )
  })
  
  test('shows legend with correct information', () => {
    render(<MapContainer vehicles={mockVehicles} />)
    
    expect(screen.getByText('Legend')).toBeInTheDocument()
    expect(screen.getByText('Vehicles')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Idle')).toBeInTheDocument()
  })
  
  test('updates markers when vehicles change', () => {
    const { rerender } = render(<MapContainer vehicles={mockVehicles} />)
    
    const updatedVehicles = [
      ...mockVehicles,
      {
        id: '3',
        name: 'Vehicle 003',
        position: [37.7949, -122.3994],
        status: 'maintenance'
      }
    ]
    
    rerender(<MapContainer vehicles={updatedVehicles} />)
    
    // Should have created 3 markers total
    expect(L.marker).toHaveBeenCalledTimes(5) // 2 initial + 3 updated
  })
})

// packages/web/tests/Dashboard.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Dashboard } from '../src/components/Dashboard'

describe('Dashboard Component', () => {
  test('renders navigation menu', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Vehicles')).toBeInTheDocument()
    expect(screen.getByText('Routes')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
  
  test('shows fleet status cards', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Idle')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // Active count
  })
  
  test('optimize button triggers optimization', async () => {
    const mockOptimize = jest.fn()
    render(<Dashboard onOptimize={mockOptimize} />)
    
    const optimizeButton = screen.getByText('Optimize Routes')
    fireEvent.click(optimizeButton)
    
    expect(optimizeButton).toBeDisabled()
    expect(screen.getByText('Optimizing...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })
  
  test('displays vehicle list with status chips', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Vehicle 001')).toBeInTheDocument()
    expect(screen.getByText('Vehicle 002')).toBeInTheDocument()
    expect(screen.getByText('Vehicle 003')).toBeInTheDocument()
    
    // Check status chips
    const activeChip = screen.getByText('active')
    const idleChip = screen.getByText('idle')
    const maintenanceChip = screen.getByText('maintenance')
    
    expect(activeChip).toHaveClass('MuiChip-colorSuccess')
    expect(idleChip).toHaveClass('MuiChip-colorWarning')
    expect(maintenanceChip).toHaveClass('MuiChip-colorError')
  })
  
  test('shows route progress bars', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Downtown Delivery')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('15 min')).toBeInTheDocument()
    
    const progressBars = screen.getAllByRole('progressbar')
    expect(progressBars).toHaveLength(greaterThan(0))
  })
})

// Integration test example
// tests/integration/route-optimization.test.js
import request from 'supertest'
import { app } from '../../src/app'
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database'

describe('Route Optimization Integration', () => {
  beforeAll(async () => {
    await setupTestDatabase()
  })
  
  afterAll(async () => {
    await cleanupTestDatabase()
  })
  
  test('complete optimization workflow', async () => {
    // 1. Create vehicles
    const vehicleResponse = await request(app)
      .post('/api/vehicles')
      .send({
        name: 'Test Truck',
        capacity: 1000,
        vehicleType: 'truck'
      })
      .expect(201)
    
    const vehicleId = vehicleResponse.body.id
    
    // 2. Create deliveries
    const deliveryResponse = await request(app)
      .post('/api/deliveries')
      .send({
        address: '123 Test Street',
        position: [37.7749, -122.4194],
        weight: 500
      })
      .expect(201)
    
    const deliveryId = deliveryResponse.body.id
    
    // 3. Request route optimization
    const optimizationResponse = await request(app)
      .post('/api/optimize')
      .send({
        vehicleIds: [vehicleId],
        deliveryIds: [deliveryId],
        depot: [37.7749, -122.4194]
      })
      .expect(200)
    
    const { routes, statistics } = optimizationResponse.body
    
    // 4. Verify optimization results
    expect(routes).toHaveLength(1)
    expect(routes[0].vehicleId).toBe(vehicleId)
    expect(routes[0].deliveries).toContain(deliveryId)
    expect(routes[0].totalDistance).toBeGreaterThan(0)
    expect(routes[0].totalDuration).toBeGreaterThan(0)
    
    expect(statistics.totalDistance).toBeGreaterThan(0)
    expect(statistics.deliverySuccess).toBe(1.0)
    expect(statistics.constraintViolations).toHaveLength(0)
  })
  
  test('real-time position updates', async () => {
    // Start WebSocket server
    const wsServer = new WebSocketServer({ port: 8081 })
    
    // Connect client
    const client = new WebSocket('ws://localhost:8081')
    await new Promise(resolve => client.on('open', resolve))
    
    // Subscribe to vehicle updates
    client.send(JSON.stringify({
      type: 'subscribe',
      channel: 'vehicle_positions',
      vehicleId: 'test-vehicle-1'
    }))
    
    // Send position update via API
    await request(app)
      .post('/api/vehicles/test-vehicle-1/position')
      .send({
        position: [37.7749, -122.4194],
        timestamp: new Date().toISOString()
      })
      .expect(200)
    
    // Verify WebSocket receives update
    const message = await new Promise(resolve => {
      client.on('message', data => {
        resolve(JSON.parse(data))
      })
    })
    
    expect(message.type).toBe('position_update')
    expect(message.vehicleId).toBe('test-vehicle-1')
    expect(message.position).toEqual([37.7749, -122.4194])
    
    client.close()
    wsServer.close()
  })
})