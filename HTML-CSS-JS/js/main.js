/**
 * Main JavaScript file for the SkillSage application
 */

// Elements
const landingPage = document.getElementById('landing-page');
const dashboardPage = document.getElementById('dashboard-page');
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const projectsContainer = document.getElementById('projects-container');
const noProjectsMessage = document.getElementById('no-projects-message');
const loadingIndicator = document.getElementById('loading-indicator');
const dataGrid = document.getElementById('data-grid');
const studentName = document.getElementById('student-name');
const studentRollNo = document.getElementById('student-rollno');
const studentBranch = document.getElementById('student-branch');
const studentCgpa = document.getElementById('student-cgpa');

// Application state
let appState = {
    rollNumber: null,
    studentData: {
        name: "John Doe",
        branch: "CSE (AIML)",
        cgpa: "9.14",
    },
    skills: [],
    githubProjects: []
};

// Hide data grid initially
dataGrid.style.display = 'none';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize WebSocket connection
    webSocketService.connect();
    
    // Add WebSocket event listeners
    webSocketService.addEventListener(handleWebSocketEvent);
    
    // Initialize UI event listeners
    initializeUI();
    
    // Set viewport settings for TV display
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.content = 'width=1920, height=1080, initial-scale=1.0';
    }
});

/**
 * Initialize UI event listeners
 */
function initializeUI() {
    // Toggle sidebar button
    toggleSidebarBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded');
            sidebar.classList.add('collapsed');
            toggleSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('expanded');
            toggleSidebarBtn.innerHTML = '<i class="fas fa-times"></i>';
        }
    });
    
    // Handle keyboard navigation for TV remote control
    document.addEventListener('keydown', handleKeyNavigation);
}

/**
 * Handle WebSocket events
 * @param {Object} event - WebSocket event
 */
function handleWebSocketEvent(event) {
    if (event.type === 'message') {
        const data = event.data;
        
        // Handle roll number update
        if (data.type === "rollUpdate" && data.roll) {
            console.log("🎯 Roll number received:", data.roll);
            appState.rollNumber = data.roll;
            studentRollNo.textContent = data.roll;
            
            // Transition from landing page to dashboard
            landingPage.classList.remove('active');
            landingPage.classList.add('hidden');
            dashboardPage.classList.remove('hidden');
            dashboardPage.classList.add('active');
            
            // Fetch data for the student
            fetchStudentData();
        }
        
        // Handle data update
        if (data.type === "dataUpdate" && data.data) {
            console.log("📊 Data update received:", data.data);
            try {
                const updateData = JSON.parse(data.data);
                if (updateData.skills) {
                    appState.skills = updateData.skills;
                    initializeSkillsChart(appState.skills);
                }
                if (updateData.githubProjects) {
                    appState.githubProjects = updateData.githubProjects;
                    renderGithubProjects();
                }
            } catch (error) {
                console.error("Error parsing data update:", error);
            }
        }
    }
}

/**
 * Fetch student data from the server
 */
function fetchStudentData() {
    // Show loading indicator
    loadingIndicator.style.display = 'flex';
    
    // Update student profile information
    updateStudentProfile();
    
    // Simple hardcoded API URL
    const apiUrl = 'http://192.168.1.12:4000/api/all-data';
    console.log(`Fetching data from: ${apiUrl}`);
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received data:', data);
            
            // Update application state
            if (data.skills) {
                appState.skills = data.skills;
                initializeSkillsChart(data.skills);
            }
            
            if (data.githubProjects) {
                appState.githubProjects = data.githubProjects;
                renderGithubProjects();
            }
            
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            dataGrid.style.display = 'grid';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loadingIndicator.innerHTML = `<p>Error loading data: ${error.message}</p>`;
        });
}

/**
 * Update student profile information
 */
function updateStudentProfile() {
    studentName.textContent = appState.studentData.name;
    studentRollNo.textContent = appState.rollNumber || 'Not available';
    studentBranch.textContent = appState.studentData.branch;
    studentCgpa.textContent = appState.studentData.cgpa;
}

/**
 * Render GitHub projects
 */
function renderGithubProjects() {
    // Clear existing projects
    while (projectsContainer.firstChild && projectsContainer.firstChild !== noProjectsMessage) {
        projectsContainer.removeChild(projectsContainer.firstChild);
    }
    
    // Check if there are projects to display
    if (!appState.githubProjects || appState.githubProjects.length === 0) {
        noProjectsMessage.style.display = 'block';
        return;
    }
    
    // Hide no projects message
    noProjectsMessage.style.display = 'none';
    
    // Render each project
    appState.githubProjects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-item';
        
        // Generate project markup
        projectElement.innerHTML = `
            <div class="project-header">
                <h4 class="project-title">${project.name || 'Unnamed Project'}</h4>
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link" tabindex="0">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
            <p class="project-description">${project.description || 'No description available'}</p>
            <p class="project-meta">Technologies: ${project.technologies ? project.technologies.join(', ') : 'Not specified'}</p>
        `;
        
        // Add to container
        projectsContainer.insertBefore(projectElement, noProjectsMessage);
    });
}

/**
 * Handle keyboard navigation for TV remote control
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyNavigation(e) {
    // Handle TV remote navigation - e.g., directional keys
    switch (e.keyCode) {
        case 37: // Left arrow
            navigateFocus('left');
            break;
        case 38: // Up arrow
            navigateFocus('up');
            break;
        case 39: // Right arrow
            navigateFocus('right');
            break;
        case 40: // Down arrow
            navigateFocus('down');
            break;
        case 13: // Enter key
            if (document.activeElement && document.activeElement.click) {
                document.activeElement.click();
            }
            break;
        default:
            break;
    }
}

/**
 * Navigate focus in the specified direction
 * @param {string} direction - Direction to navigate (left, right, up, down)
 */
function navigateFocus(direction) {
    if (!document.activeElement) return;
    
    const current = document.activeElement;
    const focusables = Array.from(
        document.querySelectorAll('button, [tabindex="0"], a, input, select, textarea')
    ).filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
    
    if (focusables.length <= 1) return;
    
    const currentRect = current.getBoundingClientRect();
    let closest = null;
    let closestDistance = Infinity;
    
    focusables.forEach(element => {
        if (element === current) return;
        
        const rect = element.getBoundingClientRect();
        let dx = 0, dy = 0;
        
        switch (direction) {
            case 'left':
                if (rect.right <= currentRect.left) {
                    dx = currentRect.left - rect.right;
                    dy = Math.abs(rect.top + rect.height/2 - (currentRect.top + currentRect.height/2));
                } else {
                    return;
                }
                break;
            case 'right':
                if (rect.left >= currentRect.right) {
                    dx = rect.left - currentRect.right;
                    dy = Math.abs(rect.top + rect.height/2 - (currentRect.top + currentRect.height/2));
                } else {
                    return;
                }
                break;
            case 'up':
                if (rect.bottom <= currentRect.top) {
                    dy = currentRect.top - rect.bottom;
                    dx = Math.abs(rect.left + rect.width/2 - (currentRect.left + currentRect.width/2));
                } else {
                    return;
                }
                break;
            case 'down':
                if (rect.top >= currentRect.bottom) {
                    dy = rect.top - currentRect.bottom;
                    dx = Math.abs(rect.left + rect.width/2 - (currentRect.left + currentRect.width/2));
                } else {
                    return;
                }
                break;
        }
        
        // Weight vertical distance more in horizontal navigation and vice versa
        const distance = direction === 'left' || direction === 'right'
            ? dx + dy * 2
            : dy + dx * 2;
            
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = element;
        }
    });
    
    if (closest) {
        closest.focus();
    }
}

// Add a function to force reload the page, bypassing cache
window.forceClearAndReload = function() {
    console.log("Forcing page reload with cache bypass");
    sessionStorage.clear();
    localStorage.clear();
    
    // Force full reload from server
    window.location.reload(true);
};
