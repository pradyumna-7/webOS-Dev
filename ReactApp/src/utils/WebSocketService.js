/**
 * For Kushal Bang....
 * Singleton WebSocket Service for the application
 * Manages a single WebSocket connection across components
 */

class WebSocketService {
  constructor() {
    // Hardcoded WebSocket URL for Docker environment
    this.url = "ws://100.29.172.241:4000/";
    this.socket = null;
    this._isConnected = false;
    this.listeners = [];
    this.reconnectAttempts = 0;
    this.reconnectInterval = null;
    this.manualClose = false;
  }

  // Connect to WebSocket server
  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    console.log("Attempting to connect to WebSocket server...");
    this.manualClose = false;
    
    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        console.log("✅ WebSocket connection established");
        this._isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyListeners({ type: 'connection', status: true });
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
        this._isConnected = false;
        this.notifyListeners({ type: 'connection', status: false, error });
      };

      this.socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
        this._isConnected = false;
        this.notifyListeners({ type: 'connection', status: false });
        
        // Only attempt to reconnect if not explicitly closed
        if (!this.manualClose) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      this._isConnected = false;
      this.scheduleReconnect();
    }
  }

  // Schedule reconnect with exponential backoff
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

  // Add event listener
  addEventListener(callback) {
    if (typeof callback === 'function' && !this.listeners.includes(callback)) {
      this.listeners.push(callback);
    }
    return () => this.removeEventListener(callback);
  }

  // Remove event listener
  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners of events
  notifyListeners(event) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in WebSocket listener:", error);
      }
    });
  }

  // Check connection status - method instead of property
  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  // Get connection status directly
  get connectionStatus() {
    return this._isConnected;
  }

  // Close connection
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
    
    this._isConnected = false;
  }
}

// Create and export a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
