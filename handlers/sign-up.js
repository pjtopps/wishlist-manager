const AWS = require('aws-sdk');
const uuid = require('uuid');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    try {
        console.log('it begins');
        const {
            group_id,
            member_name,
        } = JSON.parse(event.body);
        console.log({ group_id, member_name });
    
        const member_id = uuid();
    
        console.log({ member_id }, 'creating member');
        await ddb.put({
            TableName: 'wishlist_members',
            Item: {
                member_id,
                member_name,
                groups: [group_id],
            },
        }).promise();
        
        console.log('updating group');
        await ddb.update({
            TableName: 'wishlist_groups',
            Key: { group_id },
            UpdateExpression: 'SET members = list_append(if_not_exists(members, :empty_list), :new_member)',
            ExpressionAttributeValues: {
                ':new_member': [member_id],
                ':empty_list': [],
            },
        }).promise();

        console.log('returning');
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                member_id,
                member_name,
                group_id,
            }),
        };
        return callback(null, response);
    } catch (e) {
        console.log(e);
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ error: e }),
        });
    }
};
