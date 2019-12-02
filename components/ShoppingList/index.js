import React from 'react';

function ShoppingList({ data, unClaimItem }) {
    return (
        <div className="form">
            <h3>My shopping list</h3>
            {data.map(idea => (
                <div className="idea">
                    <p>
                        <strong>{idea.item_name}</strong>
                        {`  (For ${idea.member_name})`}
                        <br />
                        <span>{idea.item_description}</span>
                    </p>
                    <a
                        onClick={() => unClaimItem(idea.item_id)}
                    >
                        Abandon this idea
                    </a>
                </div>
            ))}
        </div>
    );
}

export default ShoppingList;
