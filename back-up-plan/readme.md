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
            targetBackupVault: 'arn:aws:backup:us-east-1:123456789012:backup-vault:MyBackupVault',
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
  }
}

const app = new cdk.App();
new MyBackupStack(app, 'MyBackupStack');
