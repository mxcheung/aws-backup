import * as cdk from 'aws-cdk-lib';
import * as backup from 'aws-cdk-lib/aws-backup';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class MyBackupStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket to store backups
    const backupBucket = new s3.Bucket(this, 'BackupBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create a backup vault
    const backupVault = new backup.BackupVault(this, 'BackupVault', {
      backupVaultName: 'MyBackupVault',
    });

    // Define the backup plan
    const backupPlan = new backup.BackupPlan(this, 'BackupPlan', {
      backupPlanName: 'MyBackupPlan',
      backupVault: backupVault,
    });

    // Add a backup rule for continuous backups
    backupPlan.addRule(new backup.BackupPlanRule({
      ruleName: 'ContinuousBackupRule',
      backupVault: backupVault,
      deleteAfter: cdk.Duration.days(30), // Adjust the retention period as needed
      scheduleExpression: cdk.aws_events.Schedule.cron({
        minute: '0',
        hour: '0',
        day: '*',
        month: '*',
        year: '*',
      }),
    }));

    // Add a periodic backup rule (e.g., daily backups)
    backupPlan.addRule(new backup.BackupPlanRule({
      ruleName: 'DailyBackupRule',
      backupVault: backupVault,
      deleteAfter: cdk.Duration.days(30), // Adjust the retention period as needed
      scheduleExpression: cdk.aws_events.Schedule.cron({
        minute: '0',
        hour: '2',
        day: '*',
        month: '*',
        year: '*',
      }),
    }));

    // Add resources to the backup plan
    backupPlan.addSelection('BackupSelection', {
      resources: [
        backup.BackupResource.fromArn('arn:aws:dynamodb:region:account-id:table/table-name'), // Example for DynamoDB table
        backup.BackupResource.fromArn('arn:aws:lambda:region:account-id:function/function-name'), // Example for Lambda function
        // Add more resources as needed
      ],
    });
  }
}

const app = new cdk.App();
new MyBackupStack(app, 'MyBackupStack');
