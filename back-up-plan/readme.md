#aws-backup-plan

```
import * as cdk from 'aws-cdk-lib';
import * as backup from 'aws-cdk-lib/aws-backup';

class MyBackupStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define an AWS Backup vault
    const backupVault = new backup.CfnBackupVault(this, 'MyBackupVault', {
      backupVaultName: 'MyBackupVault',
    });

    // Define an AWS Backup plan
    const backupPlan = new backup.CfnBackupPlan(this, 'MyBackupPlan', {
      backupPlan: {
        backupPlanName: 'MyBackupPlan',
        rules: [
          {
            ruleName: 'DailyBackup',
            targetBackupVault: backupVault.attrBackupVaultArn,
            scheduleExpression: 'cron(0 0 * * ? *)', // Daily at midnight
            startWindowMinutes: 60,
            completionWindowMinutes: 60,
            lifecycle: {
              deleteAfterDays: 30, // Retain backups for 30 days
            },
          },
        ],
      },
    });

    // add table
    backup_plan.add_selection("Selection",
     resources=[
         backup.BackupResource.from_dynamo_db_table(table)
     ])

    // Add a backup selection for the existing DynamoDB table
    const backupSelection = new backup.CfnBackupSelection(this, 'MyBackupSelection', {
      backupPlanId: backupPlan.ref,
      selectionName: 'MyBackupSelection',
      iamRoleArn: backupRole.roleArn,
      resources: [
        'arn:aws:dynamodb:us-east-1:123456789012:table/demotable', // Replace with the actual DynamoDB table ARN
      ],
    });

  }
}

const app = new cdk.App();
new MyBackupStack(app, 'MyBackupStack');
