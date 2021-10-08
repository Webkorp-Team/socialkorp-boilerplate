#!/bin/bash
echo "Waiting for Firebase Emulators to launch on localhost:5000"
while ! nc -z localhost 5000; do
  sleep 0.1
done
echo "Port localhost:5000 open."
