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

    // Reference the existing backup vault using its name or ARN
    this.backupVault = bk.BackupVault.fromBackupVaultName(this, 'ExistingBackupVault', props.existingBackupVault);

    // Associate the backup vault with the backup plan
    this.backupPlan.addBackupVault('BackupVaultAssociation', this.backupVault);

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
