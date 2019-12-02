import React, { Component } from 'react';
import { find } from 'lodash';
import IdeaForm from './IdeaForm';

class WishList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openForm: false,
            selected_item: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(data) {
        const { selected_item } = this.state;
        if (selected_item) {
            this.props.editItem(data, selected_item);
        } else {
            this.props.addNewItem(data);
        }
    }

    render() {
        const { data, removeItem } = this.props;
        const { openForm, selected_item } = this.state;

        const itemData = find(data, { item_id: selected_item }) || {}

        return (
            <div className="form">
                <h3>My Wishlist</h3>
                <p>{`${data.length} unclaimed ideas`}</p>
                {!openForm &&
                    <button
                        className="form__btn"
                        onClick={() => this.setState({ openForm: true, selected_item: null })}
                    >
                        Add new idea
                    </button>}
                {openForm &&
                    <IdeaForm
                        close={() => this.setState({ openForm: false })}
                        submit={this.handleSubmit}
                        {...itemData}
                    />}
                {data.map(idea => (
                    <div className="idea">
                        <p>
                            <strong>{idea.item_name}</strong>
                            <br />
                            <span>{idea.item_description}</span>
                        </p>
                        <a
                            onClick={() => this.setState({ openForm: true, selected_item: idea.item_id })}
                        >
                            Edit
                        </a>
                        <a
                            onClick={() => removeItem(idea.item_id)}
                        >
                            Remove from wishlist
                        </a>
                    </div>
                ))}
            </div>
        );
    }
}

export default WishList;
