import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { VRPSolver } from '../../openroute-vrp';
import type {
  VRPInstance,
  Vehicle,
  Delivery,
  Position,
  VRPSolution,
} from '../../openroute-types';

type Request = any;
type Response = any;

type PartialInstance = Partial<VRPInstance> & {
  depot?: Position;
  vehicles?: Vehicle[];
  deliveries?: Delivery[];
};

const app = express();
const solver = new VRPSolver();

app.use(cors());
app.use(express.json());

const defaultDepot: Position = [37.7749, -122.4194];

function createDefaultVehicles(): Vehicle[] {
  return [
    {
      id: 'vehicle-1',
      name: 'Main Van',
      position: defaultDepot,
      capacity: 500,
      currentLoad: 0,
      maxRange: 400,
      fuelLevel: 80,
      status: 'active',
      vehicleType: 'van',
    },
  ];
}

function createDefaultDeliveries(): Delivery[] {
  return [
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
  ];
}

function buildMatrix(size: number, fill: number): number[][] {
  return Array.from({ length: size }, () => Array(size).fill(fill));
}

function normaliseInstance(payload: PartialInstance): VRPInstance {
  const depot = payload.depot ?? defaultDepot;
  const vehicles = payload.vehicles?.length ? payload.vehicles : createDefaultVehicles();
  const deliveries = payload.deliveries?.length ? payload.deliveries : createDefaultDeliveries();

  const matrixSize = deliveries.length + 1;

  return {
    depot,
    vehicles,
    deliveries,
    distanceMatrix: payload.distanceMatrix ?? buildMatrix(matrixSize, 1),
    timeMatrix: payload.timeMatrix ?? buildMatrix(matrixSize, 5),
    constraints: payload.constraints ?? {
      capacityConstraints: true,
      timeWindowConstraints: false,
      allowSplitDeliveries: false,
    },
  };
}

function optimise(instance: VRPInstance, algorithm?: string): VRPSolution {
  switch (algorithm) {
    case 'genetic':
      return solver.solveGenetic(instance, { populationSize: 12, generations: 20 });
    default:
      return solver.solveClarkeWright(instance);
  }
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Fleet Route Optimizer API is running',
  });
});

app.post('/api/optimize', (req: Request, res: Response) => {
  try {
    const instance = normaliseInstance(req.body ?? {});
    const algorithm = typeof req.body?.algorithm === 'string' ? req.body.algorithm : undefined;
    const solution = optimise(instance, algorithm);

    res.json({
      success: true,
      algorithm: algorithm ?? 'clarke-wright',
      result: solution,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Route optimisation failed';
    res.status(500).json({ success: false, error: message });
  }
});

app.get('/api/routes/sample', (_req: Request, res: Response) => {
  const solution = solver.solveClarkeWright(normaliseInstance({}));
  res.json({ success: true, result: solution });
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (socket: any) => {
  socket.send(
    JSON.stringify({
      type: 'welcome',
      message: 'Connected to Fleet Route Optimizer updates',
      timestamp: new Date().toISOString(),
    }),
  );
});

export { app, server, wss };
export default app;
