
# Launch docker containers
docker-compose up -d

# Create attribution table
aws dynamodb create-table --cli-input-json file://table-model.json --endpoint-url http://localhost:8000 
aws dynamodb update-time-to-live --table-name books-table-dev --time-to-live-specification "Enabled=true, AttributeName=ttl" --endpoint-url http://localhost:8000