import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Form, Icon, Input, Button, message } from 'antd';
import pubSub from 'pubsub-js';

import {
  login,
  account_clear
} from '../../redux/actions'
import './login.css'

class Login extends Component{


  handleSubmit = e => {
    this.props.account_clear();
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let result = this.props.login(values);
        result.then((value) => {
          if(this.props.user.username && !this.props.user.msg){
            message.success("欢迎回来🦄");
            this.props.history.replace('/');
            pubSub.publish("nav","/");
          }else if(this.props.user.msg){
            message.warning(this.props.user.msg);
            this.props.user.msg = '';
          }
        },(err) => {
          message.warning(this.props.user.msg);
        })
      }
    });
  };

  gotoRegister = () => {
    this.props.history.push('/register');
  }



  render(){


    const { getFieldDecorator } = this.props.form;
    return (
      
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <div className='login-spec-btns'>

          <Button onClick={this.gotoRegister}  id='gotoRegister' type="dashed"  className="login-form-button">
          去注册一个!
          </Button>
          <Button  type="primary" htmlType="submit" className="login-form-button">
          登入
          </Button>
          </div>

        </Form.Item>
      </Form>
    );
  }
}

const Login2 = Form.create({ name: 'normal_login' })(Login)

export default connect(
  (state) => ({user:state.user}),
  {login, account_clear}
)(Login2);  