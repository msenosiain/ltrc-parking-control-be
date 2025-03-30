#!/bin/bash

# Directory where MongoDB data will be stored
DATA_DIR="$(pwd)/mongo-data"

# Docker image name
IMAGE_NAME="parking-control"

# Build the Docker image
echo "Building Docker image..."
docker build -t $IMAGE_NAME .

# Create the directory if it doesn't exist
mkdir -p "$DATA_DIR"

# Run the MongoDB container
echo "Running MongoDB container..."
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v "$DATA_DIR:/data/db" \
  $IMAGE_NAME

echo "MongoDB is running on port 27017 with data stored in $DATA_DIR"

