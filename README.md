# aws-backup


# Step 1 create table

# Create a DynamoDB Table Using the AWS CLI

Enter the following create-table command in the terminal:

```python

aws dynamodb\
    create-table\
        --table-name PetInventory\
        --attribute-definitions\
            AttributeName=pet_id,AttributeType=S\
        --key-schema\
            AttributeName=pet_id,KeyType=HASH\
        --billing-mode PAY_PER_REQUEST   --billing-mode PAY_PER_REQUEST


# Step 2 create back up plan


```python

aws backup create-backup \
    --backup-vault-name YourBackupVaultName \
    --resource-arn arn:aws:dynamodb:region:account-id:table/YourTableName





aws dynamodb\
    create-table\
        --table-name PetInventory\
        --attribute-definitions\
            AttributeName=pet_id,AttributeType=S\
        --key-schema\
            AttributeName=pet_id,KeyType=HASH\
        --billing-mode PAY_PER_REQUEST   --billing-mode PAY_PER_REQUEST




https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/backuprestore_HowItWorksAWS.html


https://aws.amazon.com/blogs/database/set-up-scheduled-backups-for-amazon-dynamodb-using-aws-backup/

https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-backup-plan.html

