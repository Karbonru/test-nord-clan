import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { connect } from 'react-redux';
import './FormLogin.css';
import {isUser} from '../../store/actions'

class NormalLoginForm extends React.Component {

  load = e => {
    this.props.dispatch(isUser(this.props.user))
  }

  handleSubmit = e => {
    e.preventDefault();
    const {signInWithEmailAndPassword, error} = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        signInWithEmailAndPassword(values.email, values.password).then(res => {
          this.props.dispatch(isUser(this.props.user))
        })
        if(error) {
          console.error('---->error', error);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Укажите свой E-mail!' }],
          })(
            <Input
              prefix={<Icon type="email" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="E-mail"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Укажите пароль!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Пароль"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Войти
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default connect()( WrappedNormalLoginForm);