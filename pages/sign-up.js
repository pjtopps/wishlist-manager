import React, { Component } from 'react';
import Router from 'next/router'
import axios from 'axios';
import Cookies from 'js-cookie';
import { pick } from 'lodash';
import "../static/styles/index.css"

class SignUpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            member_name: '',
            loading: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const group_query = (window.location.search || '')
            .split(/\?|\&/)
            .find(q => q.includes('group_id'));
        const group_id = (group_query || '')
            .split('=')[1];

        const existingMember = Cookies.get('member_id');
        const existingGroup = Cookies.get('group_id');
        const switchingGroup = group_id && group_id !== existingGroup;

        if (existingMember && !switchingGroup) {
            return this.setState({ loading: true }, () => Router.push('/'));
        }

        Cookies.set('group_id', group_id, { expires: 60 });
        this.setState({ group_id });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ loading: true });
        axios({
            method: 'post',
            url: 'https://q3c45tj831.execute-api.eu-west-2.amazonaws.com/v1/sign-up',
            data: pick(this.state, ['member_name', 'group_id']),
        })
            .then(({ data }) => {
                Cookies.set('member_id', data.member_id, { expires: 60 });
                Router.push('/');
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loading: false,
                    error: error.toString(),
                });
            });
    }

    render() {
        const { member_name, error, loading } = this.state;
        return (
            <div className="form">
                {loading &&
                    <div className="loading-spinner-frame">
                        <div className="lds-circle"><div></div></div>
                    </div>}
                <h3 className="form__question">
                    What name are you known by to the group?
                </h3>
                <input
                    className="form__input"
                    type="text"
                    placeholder="Name"
                    value={member_name}
                    onChange={e => this.setState({ member_name: e.target.value })}
                    
                />
                <button
                    className="form__btn"
                    onClick={this.handleSubmit}
                >
                    Join
                </button>
                {error &&
                    <h5 className="form__error">
                        {error}
                    </h5>}
            </div>
        );
    }
}
export default SignUpPage;
