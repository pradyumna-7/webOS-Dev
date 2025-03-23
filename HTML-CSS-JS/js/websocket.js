/**
 * WebSocket Service for the application
 * Manages connection with the server and provides event handling
 */

class WebSocketService {
    constructor() {
        // Simple hardcoded WebSocket URL
        this.url = "ws://192.168.1.12:4000/";
        
        console.log(`WebSocket URL settt to: ${this.url}`);
        console.log(`Running on host: ${window.location.hostname}`);
        
        this.socket = null;
        this.isConnected = false;
        this.listeners = [];
        this.reconnectAttempts = 0;
        this.reconnectInterval = null;
        this.manualClose = false;
        
        // Bind methods to instance
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.addEventListener = this.addEventListener.bind(this);
        this.removeEventListener = this.removeEventListener.bind(this);
    }

    /**
     * Connect to the WebSocket server
     */
    connect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            console.log("WebSocket already connected or connecting");
            return;
        }

        console.log(`Attempting to connect to WebSocket server at ${this.url}`);
        this.manualClose = false;
        
        try {
            this.socket = new WebSocket(this.url);
            
            this.socket.onopen = (event) => {
                console.log("✅ WebSocket connection established", event);
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.notifyListeners({ type: 'connection', status: true });
                this.updateConnectionUI(true);
                
                // Send a ping to test the connection
                this.socket.send(JSON.stringify({type: 'ping', timestamp: new Date().toISOString()}));
            };

            this.socket.onmessage = (event) => {
                console.log("📩 Received WebSocket message:", event.data);
                try {
                    const data = JSON.parse(event.data);
                    console.log("📋 Parsed message data:", data);
                    this.notifyListeners({ type: 'message', data });
                } catch (error) {
                    console.error("❌ Error parsing WebSocket message:", error);
                }
            };

            this.socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                this.isConnected = false;
                this.notifyListeners({ type: 'connection', status: false, error });
                this.updateConnectionUI(false);
            };

            this.socket.onclose = (event) => {
                console.log("Disconnected from WebSocket server", {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean
                });
                this.isConnected = false;
                this.notifyListeners({ type: 'connection', status: false });
                this.updateConnectionUI(false);
                
                // Only attempt to reconnect if not explicitly closed
                if (!this.manualClose) {
                    this.scheduleReconnect();
                }
            };
        } catch (error) {
            console.error("Error creating WebSocket:", error);
            this.isConnected = false;
            this.updateConnectionUI(false);
            this.scheduleReconnect();
        }
    }

    /**
     * Schedule reconnection with exponential backoff
     */
    scheduleReconnect() {
        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
        }
        
        const delay = Math.min(1000 * (2 ** this.reconnectAttempts), 30000);
        console.log(`Scheduling reconnect in ${delay}ms`);
        
        this.reconnectInterval = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay);
    }

    /**
     * Add event listener for WebSocket events
     * @param {Function} callback - Function to call when events occur
     * @returns {Function} Function to remove the listener
     */
    addEventListener(callback) {
        if (typeof callback === 'function' && !this.listeners.includes(callback)) {
            this.listeners.push(callback);
        }
        return () => this.removeEventListener(callback);
    }

    /**
     * Remove event listener
     * @param {Function} callback - Function to remove
     */
    removeEventListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    /**
     * Notify all listeners of events
     * @param {Object} event - Event object
     */
    notifyListeners(event) {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error("Error in WebSocket listener:", error);
            }
        });
    }

    /**
     * Update connection status UI elements
     * @param {boolean} connected - Connection status
     */
    updateConnectionUI(connected) {
        console.log(`Updating UI connection status: ${connected}`);
        const connectionElements = document.querySelectorAll('.connection-status');
        
        connectionElements.forEach(element => {
            if (connected) {
                element.classList.add('connected');
                element.classList.remove('disconnected');
                element.querySelector('.status-text').textContent = 'Connected';
            } else {
                element.classList.add('disconnected');
                element.classList.remove('connected');
                element.querySelector('.status-text').textContent = 'Disconnected';
            }
        });
    }

    /**
     * Disconnect from the WebSocket server
     */
    disconnect() {
        this.manualClose = true;
        
        if (this.reconnectInterval) {
            clearTimeout(this.reconnectInterval);
            this.reconnectInterval = null;
        }
        
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        
        this.isConnected = false;
    }
}

// Create and export a singleton instance
const webSocketService = new WebSocketService();
