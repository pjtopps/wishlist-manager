const AWS = require('aws-sdk');
const uuid = require('uuid');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    try {
        const { httpMethod } = event;
        const {
            type,
            item_name,
            item_description = '',
            unwanted = false,
            group_ids,
            member_id,
        } = JSON.parse(event.body);
        
        let item_id;
        
        if (httpMethod === 'POST') {
            item_id = uuid();
            await ddb.put({
                TableName: 'wishlist_items',
                Item: {
                    item_id,
                    item_name,
                    item_description,
                    group_ids,
                },
            }).promise();
            
            await ddb.update({
                TableName: 'wishlist_members',
                Key: { member_id },
                UpdateExpression: 'SET wishes = list_append(if_not_exists(wishes, :empty_list), :new_wish)',
                ExpressionAttributeValues: {
                    ':new_wish': [item_id],
                    ':empty_list': [],
                },
            }).promise();
        } else if (httpMethod === 'PUT') {
            item_id = event.queryStringParameters.item_id;
            if (type === 'edit') {
                await ddb.update({
                    TableName: 'wishlist_items',
                    Key: { item_id },
                    UpdateExpression: `SET item_name = :item_name, item_description = :item_description, unwanted = :unwanted`,
                    ExpressionAttributeValues: {
                        ':item_name': item_name,
                        ':item_description': item_description,
                        ':unwanted': unwanted,
                    },
                }).promise();
            } else if (type === 'claim') {
                await ddb.update({
                    TableName: 'wishlist_members',
                    Key: { member_id },
                    UpdateExpression: 'SET shopping = list_append(if_not_exists(shopping, :empty_list), :new_item)',
                    ExpressionAttributeValues: {
                        ':new_item': [item_id],
                        ':empty_list': [],
                    },
                }).promise();
            }
        }
        
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                type,
                item_name,
                item_description,
                unwanted,
                group_ids,
                member_id,
            }),
        });
    } catch (e) {
        console.log(e);
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ error: e }),
        });
    }
};
