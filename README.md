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

