# webOS App Development 

Welcome to the official repository accompanying the comprehensive blog on building, testing, and debugging webOS applications for LG TVs! This repository contains code samples, utilities, and resources referenced throughout the blog to help you develop successful applications for the webOS platform.

## Blog Reference

This repository is a companion to the comprehensive blog post: [Building Apps for LG TVs ft. webOS](https://apps-for-webos.hashnode.dev/building-apps-for-lg-tvs-ft-webos)

For detailed explanations, step-by-step guides, and best practices, be sure to read the full article!

## Repository Contents

- **Sample Apps**
  - Basic packaged web app examples
  - Hosted web app templates
  - HTML/CSS/JS implementations
  - Enact framework examples
  - React-based applications

- **Utilities**
  - Visual logger overlay for debugging
  - Development helper scripts
  - Testing utilities

- **Documentation**
  - Setup guides
  - Configuration examples
  - Best practices

## Getting Started

### Prerequisites

As mentioned in the blog, you'll need:

- webOS CLI
- webOS TV Simulator
- webOS Developer Account
- Developer Mode App (for testing on physical LG TVs)

### Installation

```bash
# Clone this repository
git clone https://github.com/yourusername/webOS-Dev.git

# Navigate to the project directory
cd webOS-Dev

# Install dependencies (if applicable)
npm install
```

## Development Approaches

### HTML/CSS/JavaScript
Basic web technologies for building simple and lightweight TV applications. Examples in this repo demonstrate the fundamentals of creating webOS apps with vanilla web technologies.

### React
Sample applications leveraging React's component-based architecture for building dynamic and responsive TV interfaces.

### Enact
Specialized UI framework from LG for webOS app development, optimized for TV interfaces. Our examples showcase how to properly structure Enact applications.

## Backend (AdminServer)
The AdminServer included in this repository serves as a backend example for webOS applications. It demonstrates:

- Creating REST APIs for your webOS app
- Handling data persistence
- Managing WebSocket communication
- Communicating between your app and server

To run the AdminServer locally:
```bash
cd AdminServer
npm install
npm start
```

## HostedWebApp Folder
The `HostedWebApp` folder is crucial for hosted web applications in webOS. It contains the necessary configuration files that enable a web application hosted on a server to be packaged as a webOS app and successfully run it on the Simulator and LG TV. 

Key components include:
- `appinfo.json`: Contains metadata about your application
- `icon.png`: The app icon displayed on the webOS launcher
- `index.html`: Entry point that loads your remote web application

### Generating HostedWebApp Structure
The `ares-generate` command creates the initial structure for your hosted web app:

```bash
# Generate a new hosted web app template
ares-generate -t hosted-webapp -p "id=com.yourdomain.app, version=1.0.0, title=My App" ./MyHostedWebApp

# This creates the basic structure with necessary configuration files
```

After generation, you'll need to edit the `appinfo.json` file to specify the URL of your hosted web application.

## Usage Examples

### Building a Basic Web App

Check the `EnactApp` directory for a complete example of a packaged web application.

### Using the Visual Logger

The repository includes the visual logger overlay solution that was discussed in detail in the blog. This overlay allows you to see console logs directly on your LG TV screen during development and testing, which is invaluable for debugging when remote DevTools access isn't available.

Refer to the blog post for complete implementation details and check the repository code for the actual implementation.

### Deploying to the Simulator or LG TV

```bash
# Package your application
ares-package ./your-app-directory

# List all the available devices
ares-setup-device --list

# Install to simulator
ares-install --device \<device_name\> your-app_1.0.0_all.ipk

# Launch the app
ares-launch --device \<device_name\> your-app
```

## Testing on LG TVs

The repository includes step-by-step instructions for connecting to and testing applications on physical LG TV devices, as detailed in the blog. See the [Testing your web app on an LG TV file](https://apps-for-webos.hashnode.dev/building-apps-for-lg-tvs-ft-webos#heading-testing-your-web-app-on-an-lg-tvhttpsapps-for-weboshashnodedevbuilding-apps-for-lg-tvs-ft-webosheading-testing-your-web-app-on-an-lg-tv) for complete instructions.

## Debugging

The debugging section includes the visual logger overlay solution discussed in the blog, allowing you to view console logs directly on your LG TV during testing.

## Blog Reference

For a complete understanding of webOS development concepts and techniques, please refer to the accompanying blog post which provides in-depth explanations for all the code and utilities found in this repository.

## Contributing

Contributions to improve the examples or add new utilities are welcome. Please feel free to submit pull requests or open issues for discussion.


---

Happy developing for webOS! If you have any questions or feedback, please open an issue in this repository or reach out through the blog comments.
