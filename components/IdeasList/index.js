import React from 'react';
import { find } from 'lodash';

function IdeasList({ data, selected_member, claimItem }) {
    const member = find(data, { id: selected_member });

    return (
        <div className="form">
            <h3>{`${member.name}'s wishlist`}</h3>
            <p>{`${member.ideas.length} available ideas`}</p>
            {member.ideas.map(idea => (
                <div className="idea">
                    <p>
                        <strong>{idea.item_name}</strong>
                        <br />
                        <span>{idea.item_description}</span>
                    </p>
                    <a
                        onClick={() => claimItem(idea.item_id)}
                    >
                        Use this idea
                    </a>
                </div>
            ))}
        </div>
    );
}

export default IdeasList;
