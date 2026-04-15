import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Duration } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as logs from "aws-cdk-lib/aws-logs";

export class MyAwsProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    //EventsTable
    const eventsTable = new dynamodb.Table(this, "EventsTable", {
      tableName: "EventsTable",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    //EventBus
    const eventBus = new events.EventBus(this, "AppEventBus", {
      eventBusName: "app-event-bus",
    });

    const backendEventsRule = new events.Rule(this, "BackendEventsRule", {
      eventBus,
      description: "Routes backend events to targets",
      eventPattern: {
        source: ["app.backend"],
        detailType: ["SomethingHappened"],
      },
    });

    //DLQ
    const eventsDlq = new sqs.Queue(this, "EventsDlq", {
      queueName: "events-dlq",
      retentionPeriod: Duration.days(14),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    //Main queue + redrive policy
    const eventsQueue = new sqs.Queue(this, "EventsQueue", {
      queueName: "events-queue",
      visibilityTimeout: Duration.seconds(30),
      removalPolicy: RemovalPolicy.DESTROY,

      deadLetterQueue: {
        queue: eventsDlq,
        maxReceiveCount: 3,
      },
    });

    // Rule -> SQS target
    backendEventsRule.addTarget(new targets.SqsQueue(eventsQueue));

    //Outputs
    new CfnOutput(this, "EventsTableName", {
      value: eventsTable.tableName,
    });
    new CfnOutput(this, "EventsQueueUrl", { value: eventsQueue.queueUrl });
    new CfnOutput(this, "EventsDlqUrl", { value: eventsDlq.queueUrl });

    //Logs Group for Lambda
    const lambdaLogGroup = new logs.LogGroup(this, "EventsConsumerLogGroup", {
      logGroupName: "events-consumer",
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Lambda
    const eventsConsumerLambda = new lambda.Function(
      this,
      "EventsConsumerLambda",
      {
        functionName: "events-consumer",
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "consumer.handler",
        code: lambda.Code.fromAsset(path.join(__dirname, "../lambda/dist")),
        timeout: Duration.seconds(10),
        logGroup: lambdaLogGroup,
      },
    );

    new CfnOutput(this, "LambdaLogGroupName", {
      value: lambdaLogGroup.logGroupName,
      description:
        "CloudWatch Logs group for the events consumer Lambda function",
    });

    // SQS -> Lambda trigger
    eventsConsumerLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(eventsQueue, {
        batchSize: 5,
      }),
    );

    // Lambda permissions: write to DynamoDB
    eventsTable.grantWriteData(eventsConsumerLambda);

    // Pass table name to Lambda via env variable
    eventsConsumerLambda.addEnvironment("TABLE_NAME", eventsTable.tableName);

    // ========================================
    // // RDS PostgreSQL for Users --> uncomment after testing local deployment with Docker
    // // ========================================

    // // VPC - Virtual Private Cloud (sieć prywatna w AWS)
    // const vpc = new ec2.Vpc(this, "AppVpc", {
    //   maxAzs: 2, // 2 Availability Zones (wysoką dostępność)
    //   natGateways: 0, // Bez NAT Gateway (oszczędność kosztów)
    // });

    // // Security Group - firewall dla bazy danych
    // const dbSecurityGroup = new ec2.SecurityGroup(this, "DatabaseSG", {
    //   vpc,
    //   description: "Security group for PostgreSQL database",
    //   allowAllOutbound: true,
    // });

    // // Pozwól na połączenia z backendu (port 5432 = PostgreSQL)
    // dbSecurityGroup.addIngressRule(
    //   ec2.Peer.anyIpv4(),
    //   ec2.Port.tcp(5432),
    //   "Allow PostgreSQL access from anywhere (for development)",
    // );

    // // Database credentials (automatycznie generowane)
    // const dbCredentials = new secretsmanager.Secret(this, "DBCredentials", {
    //   secretName: "users-db-credentials",
    //   generateSecretString: {
    //     secretStringTemplate: JSON.stringify({ username: "dbadmin" }),
    //     generateStringKey: "password",
    //     excludePunctuation: true,
    //     includeSpace: false,
    //   },
    // });

    // // RDS PostgreSQL Instance
    // const database = new rds.DatabaseInstance(this, "UsersDatabase", {
    //   engine: rds.DatabaseInstanceEngine.postgres({
    //     version: rds.PostgresEngineVersion.VER_16_6,
    //   }),
    //   instanceType: ec2.InstanceType.of(
    //     ec2.InstanceClass.T3,
    //     ec2.InstanceSize.MICRO,
    //   ),
    //   vpc,
    //   vpcSubnets: {
    //     subnetType: ec2.SubnetType.PUBLIC,
    //   },
    //   securityGroups: [dbSecurityGroup],
    //   databaseName: "usersdb",
    //   credentials: rds.Credentials.fromSecret(dbCredentials),
    //   allocatedStorage: 20,
    //   maxAllocatedStorage: 30,
    //   publiclyAccessible: true,
    //   removalPolicy: RemovalPolicy.DESTROY,
    //   deletionProtection: false,
    // });

    // Outputs - wyświetlane po deploy
    // new CfnOutput(this, "DatabaseEndpoint", {
    //   value: database.dbInstanceEndpointAddress,
    //   description: "RDS PostgreSQL endpoint (host)",
    // });

    // new CfnOutput(this, "DatabasePort", {
    //   value: database.dbInstanceEndpointPort,
    //   description: "RDS PostgreSQL port",
    // });

    // new CfnOutput(this, "DatabaseName", {
    //   value: "usersdb",
    //   description: "Database name",
    // });

    // new CfnOutput(this, "DatabaseCredentialsSecretArn", {
    //   value: dbCredentials.secretArn,
    //   description: "Secret ARN for database credentials",
    // });
  }
}
