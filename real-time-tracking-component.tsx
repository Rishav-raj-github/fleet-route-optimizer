import React, { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { RealTimeTracker } from '../../../openroute-realtime-tracker'
import { FleetManager } from '../../../openroute-fleet-manager'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  LocationOn,
  Speed,
  Warning,
  CheckCircle,
  Error,
  Refresh
} from '@mui/icons-material'

interface RealTimeTrackingProps {
  wsUrl?: string
  apiKey?: string
  vehicleIds: string[]
}

export const RealTimeTracking: React.FC<RealTimeTrackingProps> = ({
  wsUrl = 'ws://localhost:8081',
  apiKey,
  vehicleIds
}) => {
  const [fleetManager, setFleetManager] = useState<FleetManager | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting')
  const [fleetStatus, setFleetStatus] = useState<any>(null)
  const [emergencyAlerts, setEmergencyAlerts] = useState<any[]>([])
  const [efficiencyReports, setEfficiencyReports] = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const initializeFleetManager = async () => {
      try {
        const manager = new FleetManager(wsUrl, apiKey)
        
        // Set up event handlers
        manager.setEventHandlers({
          onFleetUpdate: (fleet) => {
            setFleetStatus(fleet)
            setLastUpdate(new Date())
          },
          onEmergencyAlert: (alert) => {
            setEmergencyAlerts(prev => [alert, ...prev.slice(0, 9)]) // Keep last 10 alerts
          },
          onEfficiencyReport: (report) => {
            setEfficiencyReports(prev => [report, ...prev.slice(0, 4)]) // Keep last 5 reports
          }
        })
        
        await manager.initialize()
        setFleetManager(manager)
        setConnectionStatus('connected')
        
        // Add demo vehicles for testing
        const demoVehicles = vehicleIds.map((id, index) => ({
          id,
          name: `Vehicle ${String(index + 1).padStart(3, '0')}`,
          position: [37.7749 + (Math.random() - 0.5) * 0.1, -122.4194 + (Math.random() - 0.5) * 0.1] as [number, number],
          capacity: 1000,
          currentLoad: Math.floor(Math.random() * 800),
          maxRange: 500,
          fuelLevel: 20 + Math.random() * 80,
          status: ['active', 'idle', 'maintenance'][Math.floor(Math.random() * 3)] as any,
          vehicleType: 'truck' as any
        }))
        
        demoVehicles.forEach(vehicle => manager.addVehicle(vehicle))
        
      } catch (error) {
        console.error('Failed to initialize fleet manager:', error)
        setConnectionStatus('error')
      }
    }
    
    initializeFleetManager()
    
    return () => {
      if (fleetManager) {
        fleetManager.shutdown()
      }
    }
  }, [wsUrl, apiKey])
  
  const handleRefresh = () => {
    if (fleetManager) {
      fleetManager.optimizeFleetRealTime()
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'idle': return 'warning'
      case 'maintenance': return 'error'
      default: return 'default'
    }
  }
  
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success'
      case 'connecting': return 'info'
      case 'disconnected': return 'warning'
      case 'error': return 'error'
      default: return 'default'
    }
  }
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Connection Status */}
      <Alert 
        severity={getConnectionStatusColor()} 
        sx={{ mb: 2 }}
        action={
          <Tooltip title="Refresh Fleet Data">
            <IconButton size="small" onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
        }
      >
        Real-time Tracking: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
        {lastUpdate && ` • Last Update: ${formatTimestamp(lastUpdate)}`}
      </Alert>
      
      <Grid container spacing={3}>
        {/* Fleet Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fleet Overview
              </Typography>
              
              {fleetStatus ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {fleetStatus.activeVehicles}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {fleetStatus.idleVehicles}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Idle
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error.main">
                        {fleetStatus.maintenanceVehicles}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Maintenance
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary.main">
                        {Math.round(fleetStatus.fleetEfficiency * 100)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Efficiency
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Loading fleet data...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Vehicle Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vehicle Status
              </Typography>
              
              {fleetStatus && fleetStatus.vehicles ? (
                <List dense>
                  {fleetStatus.vehicles.slice(0, 5).map((vehicleStatus: any) => (
                    <ListItem key={vehicleStatus.vehicle.id}>
                      <LocationOn 
                        sx={{ 
                          mr: 1, 
                          color: vehicleStatus.position ? 'success.main' : 'text.disabled' 
                        }} 
                      />
                      <ListItemText
                        primary={vehicleStatus.vehicle.name}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={vehicleStatus.vehicle.status}
                              color={getStatusColor(vehicleStatus.vehicle.status) as any}
                              size="small"
                            />
                            {vehicleStatus.position && (
                              <Typography variant="caption" color="text.secondary">
                                {vehicleStatus.position[0].toFixed(4)}, {vehicleStatus.position[1].toFixed(4)}
                              </Typography>
                            )}
                            {vehicleStatus.alerts.length > 0 && (
                              <Warning color="warning" fontSize="small" />
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ minWidth: 50, textAlign: 'right' }}>
                        <Typography variant="body2">
                          {Math.round(vehicleStatus.efficiency * 100)}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={vehicleStatus.efficiency * 100}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No vehicle data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Emergency Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Alerts
              </Typography>
              
              {emergencyAlerts.length > 0 ? (
                <List dense>
                  {emergencyAlerts.slice(0, 3).map((alert, index) => (
                    <ListItem key={alert.id || index}>
                      <Error 
                        color={alert.severity === 'critical' ? 'error' : 'warning'}
                        sx={{ mr: 1 }}
                      />
                      <ListItemText
                        primary={`Vehicle ${alert.vehicleId}: ${alert.type.replace('_', ' ')}`}
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(new Date(alert.timestamp))}
                            </Typography>
                            {alert.autoActions.length > 0 && (
                              <Typography variant="caption" display="block">
                                Actions: {alert.autoActions.join(', ')}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                  <CheckCircle sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    No recent alerts
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Efficiency Reports */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Optimization Results
              </Typography>
              
              {efficiencyReports.length > 0 ? (
                <Box>
                  {efficiencyReports.slice(0, 1).map((report, index) => (
                    <Box key={index}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Routes Optimized
                          </Typography>
                          <Typography variant="h6">
                            {report.routesOptimized}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Distance Saved
                          </Typography>
                          <Typography variant="h6">
                            {report.distanceSaved.toFixed(1)} km
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Time Saved
                          </Typography>
                          <Typography variant="h6">
                            {Math.round(report.timeSaved)} min
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Cost Saved
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            ${report.costSaved.toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {report.recommendations && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Recommendations:
                          </Typography>
                          {report.recommendations.map((rec: string, i: number) => (
                            <Typography key={i} variant="caption" display="block" color="text.secondary">
                              • {rec}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No optimization reports yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}