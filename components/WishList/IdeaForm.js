import React, { Component } from 'react';

class IdeaForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item_name: props.item_name || '',
            item_description: props.item_description || '',
        };
        this.submit = this.submit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.item_id !== this.props.item_id) {
            this.setState({
                item_name: this.props.item_name || '',
                item_description: this.props.item_description || '',
            });
        }
    }

    submit() {
        const { item_name, item_description } = this.state;
        this.props.submit({
            item_name,
            item_description,
        });
        this.props.close();
    }

    render() {
        const { item_name, item_description } = this.state;

        return (
            <div className="form">
                <input
                    className="form__input"
                    type="text"
                    placeholder="Idea"
                    value={item_name}
                    onChange={({ target }) => this.setState({ item_name: target.value })}
                />
                <textarea
                    className="form__input"
                    placeholder="Further notes or description"
                    value={item_description}
                    onChange={({ target }) => this.setState({ item_description: target.value })}
                />
                <div className="form-btn-holder">
                    <button
                        className="form__btn"
                        onClick={this.props.close}
                    >
                        Cancel
                    </button>
                    <button
                        className="form__btn"
                        onClick={this.submit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}

export default IdeaForm;
