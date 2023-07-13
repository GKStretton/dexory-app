# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the React build output from the previous stage.
# This only copies the built site, not the node install, hence the final
# image is MUCH smaller.
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 5000

# Start Nginx foreground so it doesn't exit
CMD ["nginx", "-g", "daemon off;"]