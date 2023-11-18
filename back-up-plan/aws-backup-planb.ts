import {
  Duration,
  CfnOutput,
  aws_backup as bk,
  aws_events as events,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface BackupProps {
  // ... (unchanged properties)

  /**
   * The name or ARN of the existing backup vault.
   */
  readonly existingBackupVault: string;
}

export class Backup extends Construct {
  public readonly backupPlan: bk.BackupPlan;
  public readonly backupVault: bk.BackupVault;

  constructor(scope: Construct, id: string, props: BackupProps) {
    super(scope, id);

    // ... (unchanged code)

    
    const startWindow = Duration.hours(1);

    const completionWindow = Duration.hours(2);

    const deleteAfter = Duration.days(30);

    // Reference the existing role
    const role = iam.Role.fromRoleName(this, props.iamRoleName, props.iamRoleName)

    // Reference the existing backup vault using its name or ARN
    this.backupVault = bk.BackupVault.fromBackupVaultName(this, 'ExistingBackupVault', props.existingBackupVault);

    // Associate the backup vault with the backup plan
    this.backupPlan.addBackupVault('BackupVaultAssociation', this.backupVault);

     // Define an AWS Backup plan rule
    const scheduledBkRule = new backup.BackupPlanRule({
      completionWindow,
      startWindow,
      deleteAfter: deleteAfter,
      // Only cron expressions are supported
      scheduleExpression: events.Schedule.cron({
        minute: '0',
        hour: '23',
      })
    });

    // Define an AWS Backup plan
   const backupPlan = new backup.BackupPlan(this, 'BackupPlan', {
      backupPlanName: props.backupPlanName,
      backupPlanRules: [scheduledBkRule],
      backupVault: backupVault
    });

   // Define BackupSelection
    let resources :BackupResource[] = [];
    props.resources.forEach(resourceArn=>{
        resources.push(BackupResource.fromArn(resourceArn))
    });
    backupPlan.addSelection('BackupSelection', {
      role: role,
      resources: resources,
    });


    // ... (unchanged code)

    // Outputs
    const outputVars = {
      BackupPlanId: this.backupPlan.backupPlanId,
      BackupPlanArn: this.backupPlan.backupPlanArn,
      BackupVaultName: this.backupVault.backupVaultName,
      BackupVaultArn: this.backupVault.backupVaultArn,
    };

    Object.entries(outputVars).forEach(([outName, outValue]) => {
      new CfnOutput(this, outName, { value: outValue });
    });
  }
}
