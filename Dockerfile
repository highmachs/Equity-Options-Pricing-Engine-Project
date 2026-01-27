# Use a base image that has both Node and Python or install one on top of the other
# Using a standard Node image and installing Python is usually easier for web-centric apps with python backends
FROM node:20-slim

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json* ./

# Install Node dependencies
RUN npm ci

# Copy Python requirements
COPY quant_engine/requirements.txt ./quant_engine/requirements.txt

# Install Python dependencies
# We use --break-system-packages because we are in a container, it's fine.
RUN pip3 install -r quant_engine/requirements.txt --break-system-packages --default-timeout=100 --no-cache-dir

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
