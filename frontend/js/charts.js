/**
 * Chart handling for skills visualization
 */


// Create debug panel for on-screen logging
(function createDebugPanel() {
    // Create a debug panel if it doesn't exist
    if (!document.getElementById('debug-panel')) {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.position = 'fixed';
        debugPanel.style.bottom = '0';
        debugPanel.style.left = '0';
        debugPanel.style.width = '100%';
        debugPanel.style.maxHeight = '30%';
        debugPanel.style.overflow = 'auto';
        debugPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        debugPanel.style.color = '#4CAF50';
        debugPanel.style.fontFamily = 'monospace';
        debugPanel.style.fontSize = '14px';
        debugPanel.style.padding = '10px';
        debugPanel.style.zIndex = '9999';
        debugPanel.style.border = '1px solid #4CAF50';
        document.body.appendChild(debugPanel);
    }
})();

// On-screen logging utilities
window.debugLog = function(message, type = 'info') {
    console.log(message); // Still log to console
    
    const debugPanel = document.getElementById('debug-panel');
    if (!debugPanel) return;
    
    const logEntry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    const typeColors = {
        'info': '#4CAF50',
        'error': '#FF5252',
        'warning': '#FFC107'
    };
    
    logEntry.style.color = typeColors[type] || typeColors.info;
    logEntry.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    logEntry.style.padding = '4px 0';
    
    let displayMessage = message;
    if (typeof message === 'object') {
        try {
            displayMessage = JSON.stringify(message);
        } catch (e) {
            displayMessage = "[Object]";
        }
    }
    
    logEntry.textContent = `[${timestamp}] [${type.toUpperCase()}] ${displayMessage}`;
    debugPanel.appendChild(logEntry);
    debugPanel.scrollTop = debugPanel.scrollHeight;
};

window.debugError = function(message) {
    window.debugLog(message, 'error');
};


// Function to dynamically load scripts
function loadScript(url) {
    return new Promise((resolve, reject) => {
        // window.debugLog(`Loading script: ${url}`);
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
            // window.debugLog(`Successfully loaded: ${url}`);
            resolve();
        };
        script.onerror = () => {
            // const error = `Failed to load script: ${url}`;
            // window.debugError(error);
            reject(new Error(`Failed to load script: ${url}`));
        };
        document.head.appendChild(script);
    });
}

// Immediately invoked function to ensure proper initialization
(async function() {
    try {
        // window.debugLog("Loading charts.js module");
        
        // Load Chart.js and plugins
        try {
            await loadScript('https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js');
            await loadScript('https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.1.0/dist/chartjs-plugin-datalabels.min.js');
            
            // Verify Chart.js loaded correctly
            if (typeof Chart === 'undefined') {
                throw new Error('Chart.js failed to initialize properly');
            }
            
            // Register plugins
            Chart.register(ChartDataLabels);
            // window.debugLog("Chart.js and plugins loaded and registered successfully");
        } catch (err) {
            // window.debugError("Error loading Chart.js libraries: " + err.message);
            console.error("Error loading Chart.js libraries:", err);
            return; // Exit initialization if libraries can't be loaded
        }
        
        // Custom color palette
        window.CHART_COLORS = [
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
        ];
        // window.debugLog("Chart colors defined");
        
        // Skills chart instance
        window.skillsChart = null;
        
        /**
         * Initialize skills chart with data
         * @param {Array} skillsData - Array of skill objects
         */
        window.initializeSkillsChart = function(skillsData) {
            // window.debugLog("initializeSkillsChart called");
            // window.debugLog("Data received: " + JSON.stringify(skillsData).substring(0, 100) + "...");
            
            try {
                const chartCanvas = document.getElementById('skills-chart');
                if (!chartCanvas) {
                    console.error("Chart canvas element not found!");
                    return;
                }
                // window.debugLog("Canvas element found");
                
                const ctx = chartCanvas.getContext('2d');
                // window.debugLog("Canvas context obtained");
                
                // Process skill data
                const labels = skillsData.map(skill => skill.skill);
                const values = skillsData.map(skill => skill.value);
                const bgColors = window.CHART_COLORS.map(color => `${color}dd`).slice(0, skillsData.length);
                const borderColors = window.CHART_COLORS.slice(0, skillsData.length);
                
                // Determine font size based on screen width
                const fontSize = window.innerWidth >= 1920 ? 18 : 12;
                const titleFontSize = window.innerWidth >= 1920 ? 18 : 14;
                const bodyFontSize = window.innerWidth >= 1920 ? 16 : 12;
                
                // Destroy previous chart instance if it exists
                if (window.skillsChart) {
                    window.skillsChart.destroy();
                }
                
                // Create chart configuration
                const chartConfig = {
                    type: 'polarArea',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: values,
                            backgroundColor: bgColors,
                            borderColor: borderColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            datalabels: {
                                display: false,
                            },
                            legend: {
                                position: "bottom",
                                labels: {
                                    color: "#fff",
                                    font: {
                                        size: fontSize,
                                    },
                                    padding: window.innerWidth >= 1920 ? 30 : 20,
                                    usePointStyle: true,
                                    boxWidth: window.innerWidth >= 1920 ? 15 : 10,
                                },
                            },
                            tooltip: {
                                titleFont: {
                                    size: titleFontSize,
                                },
                                bodyFont: {
                                    size: bodyFontSize,
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
                    }
                };
                
                // Create new chart instance
                window.skillsChart = new Chart(ctx, chartConfig);
                // window.debugLog("Chart created successfully");
                
                // Show chart container and hide loading indicator
                const loadingIndicator = document.getElementById('loading-indicator');
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                
                const dataGrid = document.getElementById('data-grid');
                if (dataGrid) dataGrid.style.display = 'grid';
                
                // window.debugLog("Chart display complete");
            } catch (err) {
                // window.debugError("Error initializing skills chart: " + err.message);
                console.error("Error initializing skills chart:", err);
            }
        };
        
        // window.debugLog("Charts module loaded successfully");
        // window.debugLog("initializeSkillsChart function is: " + (typeof window.initializeSkillsChart));
    } catch (err) {
        // window.debugError("Error in charts.js initialization: " + err.message);
        console.error("Error in charts.js initialization:", err);
    }
})();
