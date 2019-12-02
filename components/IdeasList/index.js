import React from 'react';
import { find } from 'lodash';
import { plural } from '../utils';

function IdeasList({ data, selected_member, claimItem }) {
    const member = find(data, { id: selected_member });
    const ideas_num = member.ideas.length;

    return (
        <div className="form">
            <h3>{`${member.name}'s wishlist`}</h3>
            <h4>{`${ideas_num} available ${plural(ideas_num)}`}</h4>
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
