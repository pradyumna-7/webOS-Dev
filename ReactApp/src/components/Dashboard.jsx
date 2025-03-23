import { useState, useEffect } from "react"
import { X, Menu, User, Link as LinkIcon } from "lucide-react"
import { PolarArea } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import axios from 'axios'
import logo from "../assets/icon.png"
import webSocketService from "../utils/WebSocketService"

// Register Chart.js + DataLabels plugin
ChartJS.register(RadialLinearScale, ArcElement, ChartTooltip, ChartLegend, ChartDataLabels)

// Custom color palette
const COLORS = [
  '#C94C4C', // Warm Brick Red  
  '#D3756B', // Muted Coral  
  '#DC8850', // Deep Sunset Orange  
  '#E3A857', // Rich Goldenrod  
  '#A9845C', // Earthy Sandstone  
  '#7D9D72', // Soft Olive Green  
  '#5F8575', // Muted Teal  
  '#4F759B', // Dusty Blue  
  '#4464AD', // Royal Blue  
  '#7158A1', // Deep Lavender  
  '#9A4785', // Muted Plum  
]

function StudentDashboard({ rollNumber }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [data, setData] = useState({
    skills: [],
    githubProjects: []
  })
  const [isLoading, setIsLoading] = useState(true)

  // Sample student data
  const studentData = {
    name: "John Doe",
    rollNo: rollNumber,
    branch: "CSE (AIML)",
    cgpa: "9.14",
  }

  // WebSocket connection using the shared service
  useEffect(() => {
    webSocketService.connect();
    
    setIsConnected(webSocketService.isConnected());
    
    // Add event listener for connection status
    const unsubscribe = webSocketService.addEventListener((event) => {
      if (event.type === 'connection') {
        setIsConnected(event.status);
        if (event.status) {
          console.log("✅ Dashboard WebSocket connected");
        }
      }
    });
    
    return () => {
      unsubscribe();
      // Note: We don't disconnect on unmount as this is the main view
    };
  }, []);

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Use dynamic server URL directly from the env variable
        const serverUrl = import.meta.env.VITE_SERVER_URL;
        const response = await axios.get(`http://100.29.172.241:4000/api/all-data`);
        console.log('Received data:', response.data)
        console.log('GitHub Projects:', response.data.githubProjects)

        const skills = response.data?.skills || []
        const githubProjects = response.data?.githubProjects || []

        setData({
          skills,
          githubProjects
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // PolarArea chart data
  const polarAreaData = {
    labels: data?.skills?.map(skill => skill.skill) || [],
    datasets: [
      {
        data: data?.skills?.map(skill => skill.value) || [],
        backgroundColor: COLORS.map(color => `${color}dd`).slice(0, data?.skills?.length),
        borderColor: COLORS.slice(0, data?.skills?.length),
        borderWidth: 1,
      },
    ],
  }

  // Updated polarAreaOptions for TV display
  const polarAreaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // Remove or disable data labels so there's no text in the center
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",        // White text for legend
          font: {
            size: window.innerWidth >= 1920 ? 18 : 12, // Larger font for TV
          },
          padding: window.innerWidth >= 1920 ? 30 : 20,
          usePointStyle: true,
          boxWidth: window.innerWidth >= 1920 ? 15 : 10,
        },
      },
      tooltip: {
        titleFont: {
          size: window.innerWidth >= 1920 ? 18 : 14,
        },
        bodyFont: {
          size: window.innerWidth >= 1920 ? 16 : 12,
        },
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        pointLabels: {
          display: true,
          color: "#fff",
          font: {
            size: window.innerWidth >= 1920 ? 16 : 12,
          },
        },
        ticks: {
          display: false,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0c1929]">
      {/* Header */}
      <header className="w-full bg-[#0c1929] text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="SkillSage Logo" className="w-16 h-16" />
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">SKILLSAGE</h1>
            <div className="w-48 h-0.5 bg-white my-1"></div>
            <p className="text-sm">In partnership with KMIT</p>
          </div>
        </div>
        {/* Connection status */}
        {isConnected ? (
          <div style={{ backgroundColor: '#e8f5e9', color: '#388e3c', padding: '0.25rem 1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#4caf50', borderRadius: '9999px', marginRight: '0.5rem' }}></div>
            connected
          </div>
        ) : (
          <div className="bg-red-200 text-red-700 px-4 py-1 rounded-full flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            disconnected
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex flex-1 w-full h-[calc(100vh-5rem)] overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-[#1e2a3a] h-full transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "w-64" : "w-20"
            } min-h-0 relative`}
        >
          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className="text-white absolute right-4 top-4 hover:bg-[#2a3a4a] p-1 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Profile section */}
          <div className="flex flex-col items-center pt-14 p-4 space-y-4">
            <div className="bg-white rounded-full p-1 w-16 h-16 flex items-center justify-center">
              <User className="text-gray-600" size={40} />
            </div>
            <div
              className={`text-white space-y-3 w-full px-4 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div className="border-b border-gray-600 pb-2">
                <p className="text-sm text-gray-400">Name</p>
                <p className="font-medium">{studentData.name}</p>
              </div>
              <div className="border-b border-gray-600 pb-2">
                <p className="text-sm text-gray-400">Roll Number</p>
                <p className="font-medium">{studentData.rollNo}</p>
              </div>
              <div className="border-b border-gray-600 pb-2">
                <p className="text-sm text-gray-400">Branch</p>
                <p className="font-medium">{studentData.branch}</p>
              </div>
              <div className="border-b border-gray-600 pb-2">
                <p className="text-sm text-gray-400">CGPA</p>
                <p className="font-medium">{studentData.cgpa}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0">
          <div className="bg-[#1e2a3a] rounded-lg p-8 min-h-[calc(100vh-8rem)]">
            <h2 className="text-white text-2xl font-bold">SKILLS OVERVIEW</h2>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-white text-lg">Loading data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 min-h-[calc(100vh-12rem)]">
                {/* Skills Chart (PolarArea) */}
                <div className="bg-[#0c1929] p-8 rounded-lg flex flex-col">
                  <h3 className="text-white text-lg font-semibold">Skills Distribution</h3>
                  <div className="flex-1 min-h-[500px]">
                    {data?.skills?.length > 0 ? (
                      <PolarArea
                        data={polarAreaData}
                        options={polarAreaOptions}
                      />
                    ) : (
                      <p className="text-gray-400">No skills data available</p>
                    )}
                  </div>
                </div>

                {/* GitHub Projects */}
                <div className="bg-[#0c1929] p-8 rounded-lg flex flex-col">
                  <h3 className="text-white text-lg font-semibold mb-6">GitHub Projects</h3>
                  <div className="flex-1 overflow-y-auto pr-4 space-y-4 min-h-[500px]">
                    {Array.isArray(data.githubProjects) && data.githubProjects.length > 0 ? (
                      data.githubProjects.map((project, index) => (
                        <div
                          key={index}
                          className="bg-[#1e2a3a] p-5 rounded-lg hover:bg-[#2a3a4a] transition-colors"
                        >
                          <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
                            <h4 className="text-white text-lg font-bold">
                              {project.projectName}
                            </h4>
                            <a
                              href={project.repositoryLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 p-2"
                            >
                              <LinkIcon size={18} />
                            </a>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">
                            {project.description}
                          </p>
                          <p className="text-gray-400 text-xs mb-2">
                            Author: {project.authorName} | Contributors: {project.contributors}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No GitHub projects available</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
