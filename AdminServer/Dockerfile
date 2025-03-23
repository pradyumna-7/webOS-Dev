FROM node:18-slim
WORKDIR /app
#Copy package files and install dependencies

COPY package*.json ./
RUN npm install
#Copy the rest of the application code
COPY . .
#Expose the port the server uses
EXPOSE 4000
#Start the server
CMD ["npm", "start"]
