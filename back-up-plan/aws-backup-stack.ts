import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from 'constructs'
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from "aws--dynamodb-custom-construct";
import { CfnTable } from "aws-cdk-lib/aws-dynamodb";
import * as backup from 'aws-cdk-lib/aws-backup';


const config = require('config')

export class AwsWorkshopMaxStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here

    // example resource
    const queue = new sqs.Queue(this, '-workshop-max-TestQueue')

    // example table
    const dynamodbPropsTestTable =     {
            tableName: "workshop-max-test-table",
            partitionKey: {
                name: "uuid",
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            globalSecondaryIndex: {
                indexName: "date-time-index",
                partitionKey: {
                    name: "date",
                    type: dynamodb.AttributeType.STRING,
                },
                sortKey: {
                    name: "time",
                    type: dynamodb.AttributeType.STRING
                },
                projectionType: dynamodb.ProjectionType.ALL,
            }
        }

    const table = new dynamodb.Table(this, id, {
      billingMode: dynamodbPropsTestTable.billingMode,
      partitionKey: dynamodbPropsTestTable.partitionKey,
      tableName: dynamodbPropsTestTable.tableName,
      globalSecondaryIndex: dynamodbPropsTestTable.globalSecondaryIndex,
      encryptionType: dynamodb.TableEncryption.CUSTOMER_MANAGED,
      tags: [ {
        key: "Owner",
        value: "ACME-CLIENT PTY" // removing &
      }]
    });

    // Define an AWS Backup vault
    const backupVault = new backup.CfnBackupVault(this, 'WorkshopMaxBackupVault', {
      backupVaultName: 'WorkshopMaxBackupVault',
    });    

    // Define an AWS Backup plan
    const backupPlan = new backup.CfnBackupPlan(this, 'WorkshopMaxBackupPlan', {
      backupPlan: {
        backupPlanName: 'WorkshopMaxBackupPlan',
        backupPlanRule: [
          {
            ruleName: 'DailyBackup',
            targetBackupVault: backupVault.attrBackupVaultName,
            scheduleExpression: 'cron(0 0 * * ? *)', // Daily at midnight
            startWindowMinutes: 60,
            completionWindowMinutes: 120,
            lifecycle: {
              deleteAfterDays: 30, // Retain backups for 30 days
            },
          },
        ],
      },
    });
    

  
    
    // Add a backup selection for the existing DynamoDB table
    const backupSelection = new backup.CfnBackupSelection(this, 'WorkshopMaxBackupSelection', {
      backupPlanId: backupPlan.ref,
      backupSelection: {
        iamRoleArn: 'arn:aws:iam::7051711111:role/aws-service-role/backup.amazonaws.com/AWSServiceRoleForBackup',
        selectionName: 'WorkshopMaxBackupSelection',
         resources: ['arn:aws:dynamodb:eu-central-1:7051711111:table/workshop-max-test-table']
      }
    });    
    

  }
}
