const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const router = require('./routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: true,  // Or specify your EC2 instance URL
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add API routes with prefix
app.use('/api', router);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Map to store clients with their IDs
const clients = new Map();

// Add a heartbeat mechanism to keep WebSocket connections alive
function heartbeat() {
    this.isAlive = true;
}

// WebSocket connection handling
wss.on('connection', (ws, req) => {
    // Set up heartbeat mechanism
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    
    // Generate a unique ID for this client
    const clientId = uuidv4();
    
    // Get client IP
    const ip = req.socket.remoteAddress;
    const headers = req.headers;
    console.log(`Connection attempt from: ${ip}`);
    console.log(`Origin: ${headers.origin}`);
    console.log(`User-Agent: ${headers['user-agent']}`);
    
    // Store client connection with metadata
    clients.set(clientId, {
        ws,
        ip,
        connectTime: new Date(),
        lastActive: new Date(),
        name: null // Add name field for the UI feature
    });
    
    console.log(`Client connected: ${clientId} (${ip}), Total clients: ${clients.size}`);
    
    // Send the client their ID
    ws.send(JSON.stringify({
        type: 'connection',
        clientId: clientId,
        message: 'Connected to server'
    }));
    
    // Handle incoming messages from clients
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log(`Received from ${clientId}:`, parsedMessage);
            
            // Update last active timestamp
            if (clients.has(clientId)) {
                clients.get(clientId).lastActive = new Date();
            }
            
            // Handle different message types if needed
            if (parsedMessage.type === 'ping') {
                // Respond to ping with pong
                sendToClient(clientId, {
                    type: 'pong',
                    timestamp: new Date()
                });
            }
        } catch (error) {
            console.log(`Received raw message from ${clientId}:`, message.toString());
        }
    });
    
    // Handle errors
    ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
    });
    
    // Handle client disconnection
    ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}, was connected from ${ip}`);
        // Remove client from the map
        clients.delete(clientId);
        console.log(`Remaining clients: ${clients.size}`);
    });
});

// Check for dead connections every 30 seconds
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            console.log("Terminating dead connection");
            return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', function close() {
    clearInterval(interval);
});

// Function to send message to a specific client
const sendToClient = (clientId, message) => {
    const client = clients.get(clientId);
    
    if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
        return true;
    }
    return false;
};

// Function to broadcast message to all connected clients
const broadcastMessage = (message) => {
    let count = 0;
    clients.forEach((client) => {
        if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify(message));
            count++;
        }
    });
    return count;
};

// Route 1: Get all connected clients
app.get('/clients', (req, res) => {
    const clientList = Array.from(clients).map(([id, client]) => ({
        id,
        ip: client.ip,
        connectTime: client.connectTime,
        lastActive: client.lastActive,
        name: client.name // Include name in the response
    }));
    
    res.json({
        count: clients.size,
        clients: clientList
    });
});

// New route: Update client name
app.post('/update-client-name/:clientId', (req, res) => {
    const { clientId } = req.params;
    const { name } = req.body;
    
    if (!clientId) {
        return res.status(400).json({ error: 'Client ID is required' });
    }
    
    if (!clients.has(clientId)) {
        return res.status(404).json({ error: 'Client not found' });
    }
    
    // Ensure there's always a valid name (never null or undefined)
    const clientName = (name && name.trim()) ? name.trim() : `Client`;
    
    // Update the client's name
    clients.get(clientId).name = clientName;
    console.log(`Client ${clientId} name updated to: ${clientName}`);
    
    res.json({ 
        success: true, 
        message: `Client ${clientId} name updated to: ${clientName}` 
    });
});

// Route 2: Send message to a specific client
app.post('/send-to-client/:clientId', (req, res) => {
    const { clientId } = req.params;
    const { type, data } = req.body;
    
    if (!clientId || !type) {
        return res.status(400).json({ error: 'Client ID and message type are required' });
    }
    
    if (!clients.has(clientId)) {
        return res.status(404).json({ error: 'Client not found' });
    }
    
    const success = sendToClient(clientId, {
        type,
        data,
        timestamp: new Date()
    });
    
    if (success) {
        res.json({ success: true, message: `Message sent to client ${clientId}` });
    } else {
        res.status(500).json({ error: 'Failed to send message to client' });
    }
});

// Route 3: Send roll number update (broadcast or to specific client)
app.get('/send', (req, res) => {
    const { roll, clientId } = req.query;
    
    if (!roll) {
        return res.status(400).send('Roll number is required');
    }
    
    const message = {
        type: 'rollUpdate',
        roll: roll,
        timestamp: new Date()
    };
    
    if (clientId) {
        // Send to specific client
        if (!clients.has(clientId)) {
            return res.status(404).json({ error: 'Client not found' });
        }
        
        const success = sendToClient(clientId, message);
        if (success) {
            res.send(`Roll number ${roll} has been sent to client ${clientId}`);
        } else {
            res.status(500).json({ error: 'Failed to send message to client' });
        }
    } else {
        // Broadcast to all clients
        const count = broadcastMessage(message);
        res.send(`Roll number ${roll} has been broadcast to ${count} clients`);
    }
});

// Route 4: Update data (broadcast or to specific client)
app.get('/update-data', (req, res) => {
    const { data, clientId } = req.query;
    
    if (!data) {
        return res.status(400).send('Data is required');
    }
    
    const message = {
        type: 'dataUpdate',
        data: data,
        timestamp: new Date()
    };
    
    if (clientId) {
        // Send to specific client
        if (!clients.has(clientId)) {
            return res.status(404).json({ error: 'Client not found' });
        }
        
        const success = sendToClient(clientId, message);
        if (success) {
            res.send(`Data "${data}" has been sent to client ${clientId}`);
        } else {
            res.status(500).json({ error: 'Failed to send message to client' });
        }
    } else {
        // Broadcast to all clients
        const count = broadcastMessage(message);
        res.send(`Data "${data}" has been broadcast to ${count} clients`);
    }
});

// Add a simple status endpoint for diagnostics
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        clientsConnected: clients.size,
        websocketServer: 'running'
    });
});

// Start the server
server.listen(PORT, "192.168.1.12", () => {
    console.log(`Server is running on http://192.168.1.12:${PORT}`);
    console.log(`WebSocket server is running on ws://192.168.1.12:${PORT}`);
});
