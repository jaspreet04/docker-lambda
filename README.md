# Lambda local development setup

Documentation for attribution service setup local Development

## Setup(with docker)

1. For the first time setup only we need to create the table needed to setup DynamoDB in Docker. To do this, run the ./setup.ps1 powershell script. Make sure you have the AWS-CLI setup on your machine (<https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>).

    ```bash
        ./setup.ps1
    ```

    this will setup the table and run the docker container, and you can access the service at localhost:3000/book

2. Step 1 is required for first time setup, and after that data is persistent in dynamodb volume and you can just run the below command

    ```bash
    docker compose up
    ```

    Note: If you remove the volumes manualy from docker make sure to Run the first step again.

## Unit Test Setup

```bash
yarn install 
```

To run the tests manually you can run below commads

```bash
yarn test # to run tests one time 
# or
test-watch # to run and watch tests
```
