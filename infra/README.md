# AWS CDK Local Infrastructure

This project implements a local **Event-Driven Architecture** using **AWS CDK** and **LocalStack**.

## Architecture

- **EventBridge (Bus)**: Routes messages based on source and detail type.
- **SQS (Queue)**: Acts as a buffer to ensure messages are not lost.
- **Lambda (Consumer)**: Triggered by SQS to process the data.
- **DynamoDB (Table)**: Stores the processed event details.

`EventBridge (Bus)` -> `SQS (Queue)` -> `Lambda (Consumer)` -> `DynamoDB (Table)`

---

## 🚀 Getting Started

### 1. Environment Setup

Ensure LocalStack is running via Docker. To avoid DNS issues with Node.js v22+ and LocalStack, we use `127.0.0.1` instead of `localhost`.

The region is hardcoded to **Ireland (`eu-west-1`)** in the CDK stack configuration to ensure consistency between the terminal and the local emulator.

### 2. Deployment

Run these commands from the `/infra` directory:

```bash
# Bootstrap the local environment (Run once per region)
AWS_ENDPOINT_URL=http://127.0.0.1:4566 AWS_ENDPOINT_URL_S3=http://127.0.0.1:4566 npx cdklocal bootstrap

# Deploy the stack
AWS_ENDPOINT_URL=http://127.0.0.1:4566 AWS_ENDPOINT_URL_S3=http://127.0.0.1:4566 npx cdklocal deploy
```

### 3. Testing the Flow

#### Step A: Send a Test Event

Simulate an application sending a message to the Event Bus:

```bash
aws --endpoint-url=http://127.0.0.1:4566 events put-events \
  --region eu-west-1 \
  --entries '[{
    "Source": "app.backend",
    "DetailType": "SomethingHappened",
    "Detail": "{\"id\": \"order-001\", \"type\": \"TEST\"}",
    "EventBusName": "app-event-bus"
  }]'
```

#### Step B: Verify Lambda Logs

Check if the Lambda processed the message. Note that LocalStack defaults the log group name to the function name:

```bash
aws --endpoint-url=http://127.0.0.1:4566 logs filter-log-events \
  --log-group-name /aws/lambda/events-consumer \
  --region eu-west-1
```

#### Step C: Check DynamoDB Records

Verify that the data was successfully saved to the database (replace `EventsTable` with your actual table name if different):

```bash
aws --endpoint-url=http://127.0.0.1:4566 dynamodb scan \
  --table-name EventsTable \
  --region eu-west-1
```

---

## 🛠 Troubleshooting

- **DNS Errors (EAI_AGAIN)**: Always use `127.0.0.1` in your endpoint URLs instead of `localhost`.
- **Log Groups**: LocalStack may ignore custom log group names and use the default `/aws/lambda/<function-name>`.
- **Region Mismatch**: Ensure your AWS CLI commands always include `--region eu-west-1` to match the CDK configuration.
- **Empty Scan**: If DynamoDB returns no items, ensure the Lambda has actually executed by checking the logs first.
