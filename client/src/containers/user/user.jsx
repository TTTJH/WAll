import React , {Component} from 'react';
import {connect} from 'react-redux';
import {Icon,  Modal, Button, Upload, message, Input, Popover } from 'antd';
import BScroll from 'better-scroll';
import pubSub from 'pubsub-js';

import './user.css';
import {
  getUser,
  follow,
  unFollow,
  autoLogin,//用于用户点击关注别人或取消关注别人后personal路由的关注数粉丝数的更新
} from '../../redux/actions'

const MyIcon = Icon.createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_1368816_anek3qab0ai.js', // 在 iconfont.cn 上生成s
});

class User extends Component {

  componentDidMount(){
                // 发布消息,nav隐藏
                pubSub.publish("nav","/user");
    const user = document.getElementById("user");

      this.userScroll = new BScroll(user, {
        scrollY:true,
        click: true
      })
      this.props.getUser(this.props.match.params);
  }

  goBack = () => {
    this.props.history.goBack();
  }

  followBtn = () => {
    const follow_id = this.props.otherUser._id
    const followPromise = this.props.follow({follow_id});
    followPromise
      .then(() => {
        if(!this.props.user.msg){
          this.props.autoLogin();
          message.success("关注该同学成功!");
        }else{
          message.warning("关注该同学失败，请稍后再试试!");
          this.props.user.msg = '';
        }
    })
  }

  unFollowBtn = () => {
    const unFollow_id = this.props.otherUser._id
    const unFollowPromise = this.props.unFollow({unFollow_id});
    unFollowPromise
      .then(() => {
        if(!this.props.user.msg){
          this.props.autoLogin();
          message.success("已经取消关注该同学");
        }else{
          message.warning("取消关注该同学失败，请稍后再试试!");
          this.props.user.msg = '';
        }
    })
  }

  render () {
    const {avatarUrl, sex, tags, nickName, _id, follow} = this.props.otherUser;
    return (
      <div style={{height:"100%"}}>

      <div id='user' className='user clearfix user-bscroll-wrapper'>
      <div className='user-bscroll-container'>

      <div className='personal-card clearfix'>
        <div className='user-avatar'>
          <div className='user-avatar-box'>
            <img src= {avatarUrl}/>
          </div>
        </div>

        <p className='personal-nickName'>
          <span>{nickName}</span> {sex === 'male' ? <MyIcon type="icon-male" /> : <MyIcon type="icon-female" />}
        </p>
        <p className='user-handle'>
        <Button  icon="message" shape='round'>聊天</Button>
        {this.props.user.follow.length !== 0 && this.props.user.follow.indexOf(_id) !== -1 
          ?
         <Button  shape='round' onClick={this.unFollowBtn}><Icon  type="heart" theme="twoTone" twoToneColor="#eb2f96" />已关注</Button>
          :
          <Button icon="heart" shape='round' onClick={this.followBtn}>关注</Button>
        }
        </p>
        <div className='personal-info'>
      <div className="personal-info-box">
        <p className='personal-info-num'>{follow ? follow.length : 0}</p>
        <p className='personal-info-txt'>关注</p>
      </div>
      <div className='personal-line'></div>
      <div className="personal-info-box ">
        <p className='personal-info-num'>154</p>
        <p className='personal-info-txt'>粉丝</p>
      </div>
      <div className='personal-line'></div>
      <div className="personal-info-box">
        <p className='personal-info-num'>1536</p>
        <p className='personal-info-txt'>获赞</p>
      </div>
    </div>
  </div>

        <div className='personal-tags'>
        <p className='personal-tags-title'>Tag:</p>
        <div className='user-tags-box'>
        {
          !tags
          ?
          null
          :
          tags.map((item, index) => {
            return (
              <span key={index} className='personal-tag'>
                {item}
              </span>
            )
          })
        }

        </div>
        </div>

        </div>
        </div>
        <Button onClick={this.goBack} id='user-back-btn' shape='circle'  size='large' icon='arrow-left'>
        </Button>
      </div>
      )

  }
}
export default connect(
  state => ({otherUser:state.otherUser, user:state.user}),
  {getUser, follow, unFollow, autoLogin}
)(User);