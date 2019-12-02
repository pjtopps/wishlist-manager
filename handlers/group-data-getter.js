const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {
    try {
        console.log('it begins');
        const {
            group_id,
            member_id,
        } = event.queryStringParameters;
        console.log({ member_id });
        
        const response = { member_id };
    
        const { Item } = await ddb.get({
            TableName: 'wishlist_groups',
            Key: { group_id },
        }).promise();

        const group_member_ids = Item.members.map(member_id => ({ member_id }));
        const result = await ddb.batchGet({
            RequestItems: {
                'wishlist_members': {
                    Keys: group_member_ids,
                },
            },
        }).promise();
        const group_members = result.Responses.wishlist_members;

        const shopping_ids = group_members
            .find(m => m.member_id === member_id)
            .shopping || [];
        let shopping = [];

        let claimed_items = [];
        group_members.forEach(m => claimed_items.push(...(m.shopping || [])));
        
        const group_members_enriched = await Promise.all(group_members.map(async member => {
            let ideas = [];
            if (member.wishes) {
                const result = await ddb.batchGet({
                    RequestItems: {
                        'wishlist_items': {
                            Keys: member.wishes.map(item_id => ({ item_id })),
                        },
                    },
                }).promise();
                ideas = result.Responses.wishlist_items;
                const buying = ideas
                    .filter(idea => shopping_ids.includes(idea.item_id))
                    .map(i => ({ ...i, member_name: member.member_name }));
                shopping.push(...buying);
            }

            ideas = ideas.filter(idea => !claimed_items.includes(idea.item_id));

            if (member.member_id === member_id) {
                response.member_name = member.member_name;
                response.wishlist = ideas;
                return null;
            }

            return {
                name: member.member_name,
                id: member.member_id,
                ideas,
            };
        }));
        
        response.shopping = shopping;
        response.wishlist;
        response.group_members = group_members_enriched.filter(m => m);
        
        return callback(null, {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(response),
        });
    } catch (e) {
        console.log(e);
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ error: e }),
        });
    }
};
