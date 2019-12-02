import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import IdeaList from '../components/IdeasList';
import WishList from '../components/WishList';
import ShoppingList from '../components/ShoppingList';
import "../static/styles/index.css"

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: {},
            selected: null,
        };
        this.getGroupData = this.getGroupData.bind(this);
        this.viewMember = this.viewMember.bind(this);
        this.claimItem = this.claimItem.bind(this);
        this.unClaimItem = this.unClaimItem.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    componentDidMount() {
        this.getGroupData();
    }

    getGroupData() {
        const group_id = Cookies.get('group_id');
        const member_id = Cookies.get('member_id');

        axios({
            method: 'get',
            url: 'https://q3c45tj831.execute-api.eu-west-2.amazonaws.com/v1/group',
            params: { group_id, member_id },
        })
            .then(({ data }) => this.setState({ data, loading: false, group_id, member_id }))
            .catch(error => this.setState({
                loading: false,
                error: error.toString(),
                group_id,
                member_id,
            }));
    }

    viewMember(id) {
        this.setState({
            viewing: 'member',
            selected_member: id,
        });
    }

    claimItem(item_id) {
        const { member_id } = this.state;
        this.setState({ loading: true }, () => {
            axios({
                method: 'put',
                url: 'https://q3c45tj831.execute-api.eu-west-2.amazonaws.com/v1/idea',
                params: { item_id },
                data: { member_id, type: 'claim' },
            })
                .then(this.getGroupData)
                .catch(error => {
                    console.log(error)
                    this.setState({
                        loading: false,
                        error: error.toString(),
                    });
                });
        });
    }

    unClaimItem() {
        // TODO
    }

    addNewItem(payload) {
        const { member_id, group_id } = this.state;
        this.setState({ loading: true }, () => {
            axios({
                method: 'post',
                url: 'https://q3c45tj831.execute-api.eu-west-2.amazonaws.com/v1/idea',
                data: {
                    ...payload,
                    member_id,
                    group_ids: [group_id]
                },
            })
                .then(this.getGroupData)
                .catch(error => {
                    console.log(error)
                    this.setState({
                        loading: false,
                        error: error.toString(),
                    });
                });
        });
    }

    editItem(payload, item_id) {
        const { member_id } = this.state;
        this.setState({ loading: true }, () => {
            axios({
                method: 'put',
                url: 'https://q3c45tj831.execute-api.eu-west-2.amazonaws.com/v1/idea',
                params: { item_id },
                data: {
                    ...payload,
                    member_id,
                    type: 'edit',
                },
            })
                .then(this.getGroupData)
                .catch(error => {
                    console.log(error)
                    this.setState({
                        loading: false,
                        error: error.toString(),
                    });
                });
        });
    }

    removeItem() {
        // TODO
    }

    render() {
        const {
            loading,
            data,
            viewing,
            selected_member,
        } = this.state;

        let body;
        if (isEmpty(data)) body = <div></div>;
        else if (viewing === 'member') {
            body = (
                <IdeaList
                    selected_member={selected_member}
                    data={data.group_members}
                    claimItem={this.claimItem}
                />);
        } else if (viewing === 'wishlist') {
            body = (
                <WishList
                    data={data.wishlist}
                    addNewItem={this.addNewItem}
                    editItem={this.editItem}
                    removeItem={this.removeItem}
                />
            );
        } else if (viewing === 'shopping') {
            body = (
                <ShoppingList
                    data={data.shopping}
                    unClaimItem={this.unClaimItem}
                />
            );
        } else {
            body = (
                <div className="form">
                    <h3>{`Welcome ${data.member_name}!`}</h3>
                    <button
                        className="form__btn"
                        onClick={() => this.setState({ viewing: 'wishlist' })}
                    >
                        My wishlist
                    </button>
                    <button
                        className="form__btn"
                        onClick={() => this.setState({ viewing: 'shopping' })}
                    >
                        My shopping list
                    </button>
                    {data.group_members.map(m => (
                        <div
                            className="card"
                            role="presentation"
                            onClick={() => this.viewMember(m.id)}
                        >
                            <p>
                                <strong>{m.name}</strong>
                                <span>
                                    {`${m.ideas.length} ideas available`}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div>
                {loading &&
                    <div className="loading-spinner-frame">
                        <div className="lds-circle"><div></div></div>
                    </div>}
                {!!viewing &&
                    <button
                        className="form__btn back-btn"
                        onClick={() => this.setState({ viewing: null })}
                    >
                        Go back
                    </button>}
                {body}
            </div>
        );
    }
}

export default HomePage;
