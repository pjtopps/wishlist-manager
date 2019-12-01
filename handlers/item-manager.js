const AWS = require('aws-sdk');
const uuid = require('uuid');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    try {
        const { httpMethod } = event;
        const {
            item_name,
            item_description = '',
            dreamer_id,
            giver_id = false,
            unwanted = false,
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
                    dreamer_id,
                },
            }).promise();
        } else if (httpMethod === 'PUT') {
            item_id = event.queryStringParameters.item_id;
            await ddb.update({
                TableName: 'wishlist_items',
                Key: { item_id },
                UpdateExpression: `SET item_name = :item_name, item_description = :item_description, giver_id = :giver_id, unwanted = :unwanted`,
                ExpressionAttributeValues: {
                    ':item_name': item_name,
                    ':item_description': item_description,
                    ':giver_id': giver_id,
                    ':unwanted': unwanted,
                },
            }).promise();
        }
        
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                item_id,
                item_name,
                item_description,
                dreamer_id,
                giver_id,
                unwanted,
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
