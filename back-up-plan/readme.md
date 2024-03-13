# aws-backup-plan

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
```

# permission related issues

```
Failed resources:
WeeklyBackupAwsBackupPlanCdkStack | 5:04:13 AM | CREATE_FAILED       | AWS::Backup::BackupSelection | WeeklyBackupSelection Resource handler returned message: "User: arn:aws:sts::12344:assumed-role/cdk-hnds-cfn-exec-role-12344-eu-central-1/AWSCloudFormation is not authorized to perform: iam:PassRole on resource: arn:aws:iam::12344:role/local-backup-vault-role with an explicit deny in an identity-based policy 
(Service: Backup, Status Code: 403, Request ID: 1b646fd7-af06-4104-9350-c9ed82086b7c)" (RequestToken: bf2a83c8-675f-78fa-3bac-d5f04e5416a1, HandlerErrorCode: GeneralServiceException)
```

# restore
Start the Restore Job: Once you have identified the recovery point you want to restore, initiate the restore job using the start-restore-job command:
```
aws backup start-restore-job --recovery-point-arn YOUR_RECOVERY_POINT_ARN --metadata '{"TableName":"YOUR_TARGET_TABLE_NAME"}'
```
Replace YOUR_RECOVERY_POINT_ARN with the ARN (Amazon Resource Name) of the recovery point you want to restore, and YOUR_TARGET_TABLE_NAME with the name of the DynamoDB table where you want to restore the data.

# monitor
```
aws backup describe-restore-job --restore-job-id YOUR_RESTORE_JOB_ID
```


