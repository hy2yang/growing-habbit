import { Form, Icon, Input, Button } from 'antd';
import 'antd/lib/form/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/button/style/css';

import RegisterModal from './RegisterModal';

import React, { Component } from 'react';

const FormItem = Form.Item;


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerModalVisible : false
        };
    }

    showRegisterModal(){
        this.setState({ registerModalVisible: true });
    }

    hideRegisterModal(){
        this.setState({ registerModalVisible: false });
    }

    componentDidMount() {
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.loginSubmit(values);
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <div className="account">
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <FormItem validateStatus={userNameError ? 'error' : ''} help={userNameError || ''} >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''} >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} >
                            Log in
                        </Button>                        
                    </FormItem> 
                    <FormItem>
                        <RegisterModal 
                        showRegisterModal = {this.showRegisterModal.bind(this)} 
                        hideRegisterModal = {this.hideRegisterModal.bind(this)} 
                        registerModalVisible = {this.state.registerModalVisible}
                        registerSubmit = {this.props.registerSubmit}
                        />
                    </FormItem>                 
                </Form>
            </div>
        );
    }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);
export default WrappedHorizontalLoginForm;
