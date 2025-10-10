const assert = require('assert');
const { VRPSolver } = require('../dist/openroute-vrp.js');

function createInstance() {
  const depot = [37.7749, -122.4194];

  return {
    depot,
    vehicles: [
      {
        id: 'vehicle-1',
        name: 'Primary Van',
        position: depot,
        capacity: 500,
        currentLoad: 0,
        maxRange: 400,
        fuelLevel: 75,
        status: 'active',
        vehicleType: 'van',
      },
    ],
    deliveries: [
      {
        id: 'delivery-1',
        address: '1 Market St',
        position: [37.7849, -122.4094],
        priority: 'high',
        serviceTime: 10,
        weight: 120,
        volume: 3,
      },
      {
        id: 'delivery-2',
        address: '2 Mission St',
        position: [37.7949, -122.3994],
        priority: 'medium',
        serviceTime: 12,
        weight: 150,
        volume: 2,
      },
    ],
    distanceMatrix: [
      [0, 1, 2],
      [1, 0, 1.5],
      [2, 1.5, 0],
    ],
    timeMatrix: [
      [0, 5, 7],
      [5, 0, 6],
      [7, 6, 0],
    ],
    constraints: {
      capacityConstraints: true,
      timeWindowConstraints: false,
      allowSplitDeliveries: false,
    },
  };
}

function testClarkeWright() {
  const solver = new VRPSolver();
  const instance = createInstance();
  const result = solver.solveClarkeWright(instance);

  assert.strictEqual(result.feasible, true, 'Solution should be feasible');
  assert.strictEqual(result.routes.length, 1, 'Should produce a single route');

  const [route] = result.routes;
  assert.strictEqual(route.vehicleId, 'vehicle-1', 'Route should use the available vehicle');
  assert.ok(route.sequence.includes('delivery-1'));
  assert.ok(route.sequence.includes('delivery-2'));
  assert.ok(route.distance > 0);
}

function testGenetic() {
  const solver = new VRPSolver();
  const instance = createInstance();
  const result = solver.solveGenetic(instance, {
    populationSize: 10,
    generations: 20,
    mutationRate: 0.1,
    crossoverRate: 0.9,
    eliteSize: 2,
  });

  assert.strictEqual(result.feasible, true, 'Genetic solver should produce feasible solution');
  const assigned = result.routes.flatMap((route) => route.sequence);
  assert.ok(assigned.includes('delivery-1'));
  assert.ok(assigned.includes('delivery-2'));
  assert.ok(result.objectiveValue > 0);
}

function run() {
  testClarkeWright();
  testGenetic();
  console.log('All route optimization tests passed.');
}

run();
