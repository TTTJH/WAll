import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import BScroll from 'better-scroll'
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Button,
  Radio,
  message
} from 'antd';
import pubSub from 'pubsub-js';

import {
  register,
} from '../../redux/actions'

import './register.css'

class Register extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  //设置raido默认值
  componentDidMount(){
    this.props.form.setFieldsValue({
      sex: 'male',
    });
    const registerWrapper = document.querySelector('.register-wrapper');
     this.RegisterScroll = new BScroll(registerWrapper,{
      scrollY: true,
      click: true
  })
  }

  

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let result = this.props.register(values);
        result.then((value) => {
          if(this.props.user.username && !this.props.user.msg){
            message.success('欢迎入驻，快去寻找乐趣吧🦄');
            this.props.history.replace('/personal');
            pubSub.publish("nav","/personal");
          }else if(this.props.user.msg){
            message.warning(this.props.user.msg);
            this.props.user.msg = '';
          }
        },(err) => {
          message.warning(this.props.user.msg);
          this.props.user.msg = '';
        })
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  gotoLogin = () => {
    this.props.history.replace('/login');
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div className='register-wrapper'>
        <div className='register-container'>

      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label='用户名'>
          {getFieldDecorator('username', {
            rules: [
              {
                // type: 'text',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: '用户名不能为空噢',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="密码" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '密码不能为空噢',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="确认密码" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '确认密码不能为空噢',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>

      <Form.Item
          label={
            <span>
              性别&nbsp;
              {/* <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip> */}
            </span>
          }
        >
      {getFieldDecorator('sex',{
                    rules: [
                      {
                        required: true,
                        message: '两次密码不一样噢',
                      },
                    ],
      })(
      <Radio.Group  buttonStyle="solid">
          <Radio.Button  value="male">男生</Radio.Button>
          <Radio.Button value="female">女生</Radio.Button>
        </Radio.Group>)}
        </Form.Item>

        <Form.Item
          label={
            <span>
              社区昵称&nbsp;
              <Tooltip title="你希望别人怎么称呼你呢？">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('nickName', {
            rules: [{ required: true, message: '社区昵称必须要填写噢', whitespace: true }],
          })(<Input />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout} >
          <div className='register-spec-btns'>
          <Button type="dashed" onClick={this.gotoLogin} >
            已经有账号？
          </Button>
          <Button type="primary" htmlType="submit" >
            注册
          </Button>

          </div>
        </Form.Item>
      </Form>
      </div>
      </div>

    );
  }
}
const Register2 = Form.create({ name: 'register' })(Register);

export default connect(
  state => ({user:state.user}) ,
  {register}
)(Register2);