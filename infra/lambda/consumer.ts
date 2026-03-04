import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {
  console.log("Lambda invoked ✅");
  console.log("Raw event:", JSON.stringify(event, null, 2));

  const records = event.Records ?? [];
  console.log("Records count:", records.length);

  for (const record of records) {
    console.log("---- SQS Record ----");
    console.log("messageId:", record.messageId);
    console.log("body:", record.body);

    try {
      const parsedBody = JSON.parse(record.body);
      console.log("Parsed body:", JSON.stringify(parsedBody, null, 2));

      if (parsedBody?.detail) {
        const detail = parsedBody.detail;
        console.log("detail:", JSON.stringify(detail, null, 2));
        console.log("detail.id:", detail.id);

        // Save to DynamoDB with idempotency
        try {
          await docClient.send(
            new PutCommand({
              TableName: TABLE_NAME,
              Item: {
                id: detail.id,
                type: detail.type,
                createdAt: detail.createdAt,
                payload: detail.payload,
                processedAt: new Date().toISOString(),
              },
              ConditionExpression: "attribute_not_exists(id)",
            }),
          );
          console.log(`✅ Saved to DynamoDB: ${detail.id}`);
        } catch (err: any) {
          if (err.name === "ConditionalCheckFailedException") {
            console.log(
              `⚠️  Item already exists (duplicate event): ${detail.id}`,
            );
          } else {
            throw err;
          }
        }
      }
    } catch (e) {
      console.log("Error processing record:", String(e));
      throw e; // Re-throw to send to DLQ
    }
  }
  return { ok: true };
};
