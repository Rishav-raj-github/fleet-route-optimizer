// Test setup configuration for Jest
import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'

// Configure testing library
configure({ testIdAttribute: 'data-testid' })

// Mock Leaflet for tests
global.L = {
  map: jest.fn(() => ({
    setView: jest.fn(),
    addTo: jest.fn(),
    remove: jest.fn(),
    eachLayer: jest.fn(),
    removeLayer: jest.fn()
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn()
  })),
  marker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn()
  })),
  polyline: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn()
  })),
  divIcon: jest.fn(),
  Icon: {
    Default: {
      prototype: {},
      mergeOptions: jest.fn()
    }
  }
}

// Mock WebSocket for tests
global.WebSocket = jest.fn(() => ({
  send: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: 1, // OPEN
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}))

// Mock geolocation API
global.navigator.geolocation = {
  getCurrentPosition: jest.fn((success) => {
    success({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10
      }
    })
  }),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
}

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock performance API
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn()
}

// Setup test database
beforeAll(async () => {
  // Initialize test database if needed
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/openroute_test'
  process.env.REDIS_URL = 'redis://localhost:6379/1'
})

// Cleanup after tests
afterEach(() => {
  jest.clearAllMocks()
})

// Global test utilities
global.waitFor = (condition, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const check = () => {
      if (condition()) {
        resolve(true)
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'))
      } else {
        setTimeout(check, 100)
      }
    }
    check()
  })
}

global.createTestVehicle = (overrides = {}) => ({
  id: 'test-vehicle-' + Math.random().toString(36).substr(2, 9),
  name: 'Test Vehicle',
  position: [37.7749, -122.4194],
  capacity: 1000,
  currentLoad: 0,
  maxRange: 500,
  fuelLevel: 80,
  status: 'idle',
  vehicleType: 'truck',
  ...overrides
})

global.createTestDelivery = (overrides = {}) => ({
  id: 'test-delivery-' + Math.random().toString(36).substr(2, 9),
  address: '123 Test Street, San Francisco, CA',
  position: [37.7749 + Math.random() * 0.01, -122.4194 + Math.random() * 0.01],
  priority: 'medium',
  serviceTime: 15,
  weight: 100,
  volume: 50,
  ...overrides
})

global.createTestRoute = (overrides = {}) => ({
  id: 'test-route-' + Math.random().toString(36).substr(2, 9),
  vehicleId: 'test-vehicle-1',
  segments: [
    {
      start: [37.7749, -122.4194],
      end: [37.7849, -122.4094],
      distance: 1.5,
      duration: 3,
      instruction: 'Head north on Test Street'
    }
  ],
  deliveries: [],
  totalDistance: 1.5,
  totalDuration: 3,
  totalCost: 0.75,
  efficiency: 0.9,
  constraints: {
    timeWindows: true,
    vehicleCapacity: true,
    driverHours: true
  },
  ...overrides
})