"use client"

import { useState, useEffect } from "react"
import "./App.css"
import logo from "./assets/icon.png"
import StudentDashboard from "./components/Dashboard"
import webSocketService from "./utils/WebSocketService"

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [rollNumber, setRollNumber] = useState(null)

  useEffect(() => {
    // Set viewport settings for TV display
    document.querySelector('meta[name="viewport"]')?.remove();
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=1920, height=1080, initial-scale=1.0';
    document.getElementsByTagName('head')[0].appendChild(viewportMeta);
    
    // Connect to WebSocket server if not already connected
    webSocketService.connect();
    
    // Add event listener for WebSocket events
    const unsubscribe = webSocketService.addEventListener((event) => {
      if (event.type === 'connection') {
        setIsConnected(event.status);
      } else if (event.type === 'message') {
        const data = event.data;
        
        // Check for rollUpdate message type
        if (data.type === "rollUpdate" && data.roll) {
          console.log("🎯 Roll number received:", data.roll);
          setRollNumber(data.roll);
        }
      }
    });
    
    // Clean up event listener on component unmount
    return () => {
      unsubscribe();
      // Note: We don't disconnect here to maintain connection for Dashboard
    };
  }, []);

  if (rollNumber) {
    return <StudentDashboard rollNumber={rollNumber} />
  }

  // TV-friendly styling with safe area consideration
  return (
    <div style={{
      height: "1080px",
      width: "1920px", 
      background: "linear-gradient(to bottom, #0c1929, #1e293b)",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "0",
      overflow: "hidden",
      position: "relative",
      margin: "0"
    }}>
      {/* TV safe area container (90% of the screen) */}
      <div style={{
        width: "80%",
        height: "80%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          width: "800px", 
          background: "white", 
          borderRadius: "2rem", 
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          gap: "3rem"
        }}>
          {/* Logo container with improved size for TV */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: "9999px",
              filter: "blur(24px)",
              opacity: "0.2"
            }}></div>
            <img 
              src={logo} 
              alt="Sample Logo" 
              style={{
                position: "relative",
                width: "200px",
                height: "200px",
                margin: "0 auto",
                transition: "transform 0.3s",
                animation: "pulse 2s infinite",
              }}
            />
          </div>

          {/* Text content with larger fonts for TV */}
          <div style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "2rem"
          }}>
            <h1 style={{
              fontSize: "4rem",
              lineHeight: "4.5rem",
              fontWeight: "bold",
              color: "#111827",
              letterSpacing: "-0.025em",
              animation: "pulse 2s infinite"
            }}>
              UPSKILL
            </h1>
            
            <div style={{
              height: "0.25rem",
              width: "8rem",
              background: "linear-gradient(to right, #3b82f6, #2563eb)",
              margin: "0 auto"
            }}></div>
            
            <p style={{
              fontSize: "2.5rem",
              lineHeight: "3rem",
              fontWeight: "600",
              color: "#374151"
            }}>
              In partnership with XYZ
            </p>
          </div>

          {/* Connection status with larger sizing for TV */}
          <div style={{
            display: "flex",
            justifyContent: "center"
          }}>
            {isConnected ? (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                borderRadius: "9999px",
                backgroundColor: "#f0fdf4",
                border: "2px solid #bbf7d0"
              }}>
                <div style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "9999px",
                  backgroundColor: "#22c55e",
                  marginRight: "1rem",
                  animation: "pulse 2s infinite"
                }}></div>
                <span style={{
                  color: "#15803d",
                  fontWeight: "500",
                  fontSize: "2rem"
                }}>Connected</span>
              </div>
            ) : (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                borderRadius: "9999px",
                backgroundColor: "#fef2f2",
                border: "2px solid #fecaca"
              }}>
                <div style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "9999px",
                  backgroundColor: "#ef4444",
                  marginRight: "1rem"
                }}></div>
                <span style={{
                  color: "#b91c1c",
                  fontWeight: "500",
                  fontSize: "2rem"
                }}>Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

