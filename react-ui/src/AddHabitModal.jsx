import React, { Component } from 'react';
import { Modal, Form, Input, Radio } from 'antd';
import 'antd/lib/modal/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/radio/style/css';

const FormItem = Form.Item;

const NewHabitForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Create a new habit"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label='Habit name'>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, whitespace: true, message: 'name this habit' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label='Optional: details or descripstions.'>
                            {getFieldDecorator('descr', {
                                rules: [{ whitespace: true, message: 'only white spaces detected' }],
                            })(
                                <Input type='textarea' />
                            )}
                        </FormItem>
                        <FormItem >
                            {getFieldDecorator('shared', {
                                initialValue: true,
                            })(
                                <Radio.Group>
                                    <Radio value={true}>Public</Radio>
                                    <Radio value={false}>Private</Radio>
                                </Radio.Group>
                            )}
                        </FormItem>

                    </Form>
                </Modal>
            );
        }
    }
);

class AddHabitModal extends Component {

    handleAddSubmit = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) return;
            //console.log('receive data from form', values);
            form.resetFields();
            this.props.createHabit(values);
            this.props.hideAddModal();
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
                <NewHabitForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.props.addModalVisible}
                    onCancel={() => {
                        this.props.hideAddModal();
                        this.formRef.props.form.resetFields();
                    }}
                    onCreate={this.handleAddSubmit}
                />
            </div>
        );
    }
}

export default AddHabitModal;