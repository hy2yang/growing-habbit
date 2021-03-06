import React, { Component } from 'react';
import { Button, Modal, Form, Input, Tooltip } from 'antd';
import 'antd/lib/button/style/css';
import 'antd/lib/modal/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/tooltip/style/css';

const FormItem = Form.Item;

const RegisterForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Create a new account"
                    okText="Register"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label='Username' extra='valid syntax :4-20 characters of a-zA-Z0-9._ , no ._ at start or end or consecutive'>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, pattern: require('./config').REGEX.USERNAME, message: 'invalid syntax!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label='Password' extra='valid syntax : 4-20 characters'>
                            {getFieldDecorator('password0', {
                                rules: [{ required: true, pattern: require('./config').REGEX.PW, whitespace: true, message: 'invalid syntax!' }],
                            })(
                                <Input type='password' />
                            )}
                        </FormItem>
                        <FormItem label='Password Again' extra='valid syntax : 4-20 characters, two inputs of password must be consistant'>
                            {getFieldDecorator('password1', {
                                rules: [{ required: true, pattern: require('./config').REGEX.PW, whitespace: true, message: 'invalid syntax!' },
                                { validator : (rule, value, callback) => {                   
                                    if (value && value !== form.getFieldValue('password0')) {
                                      callback('Two passwords that you enter is inconsistent!');
                                    } else {
                                      callback();
                                    }
                                }
                            }],
                            })(
                                <Input type='password' />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

class RegisterModal extends Component {

    handleRegisterSubmit = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) return;
            const body = {username : values.username};
            body.password = values.password0;
            this.props.registerSubmit(body);
            form.resetFields();
            this.props.hideRegisterModal();
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    compareToFirstPassword = (value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
    }

    render() {
        return (
            <div>
                <Tooltip placement='bottom' title={'register'}>
                    <Button icon='user-add' onClick={this.props.showRegisterModal}></Button>
                </Tooltip> 
                <RegisterForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.props.registerModalVisible}
                    onCancel={() => {
                        this.props.hideRegisterModal();
                        this.formRef.props.form.resetFields();
                    }}
                    onCreate={this.handleRegisterSubmit}
                />
            </div>
        );
    }
}

export default RegisterModal;