import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Icon,  Modal, Button, Upload, message, Input, Popover } from 'antd';
import BScroll from 'better-scroll';
import Cookies from 'js-cookie';
import pubSub from 'pubsub-js';

import {
  autoLogin,
  account_clear,
  addTag,
  removeTag
}from '../../redux/actions'

import './personal.css';

const { confirm } = Modal;

// antd中使用iconfont图标引入方法
const MyIcon = Icon.createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_1368816_anek3qab0ai.js', // 在 iconfont.cn 上生成s
});



class Personal extends Component {

    state = {
      visible: false,
      tagAddValue:"",
      tagChoose:"",
      tagRemoveStatus:false
    }

  componentDidMount(){
    pubSub.publish("nav","/personal");
    const personal = document.getElementById("personal");

      this.listScroll = new BScroll(personal, {
        scrollY:true,
        click: true
      })
    this.props.user.msg = '';
  }

   avatarProps = {
    name: 'file',
    action: '/avatarUpload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange:(info)=>{
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') { 
        const doneStatus = document.querySelectorAll('.ant-upload-list-item-done');
        doneStatus.forEach(item => {
          item.style.display = 'none';
        })
        message.success(`头像上传成功`);
        this.props.autoLogin();
      } else if (info.file.status === 'error') {
        message.error(`头像上传失败，请重试`);
      }
    },
  };

  gotoLogin = () => {
    this.props.history.push('/login');
  }

  signout = () => {
    Cookies.remove('_id');
    message.warning('已成功退出🙊');
    this.props.history.replace('/login');
    this.props.account_clear();
  }

  showDeleteConfirm = () => {
    const signout = this.signout;
    confirm({
      title: '客官确定要退出该账号嘛？',
      content: '退出后会跳转至登入界面噢',
      okText: '确定',
      okType: 'danger',
      cancelText: '关闭',
      onOk:signout,
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  /* vvv tags add增加按钮模态框 vvv */
  tagAddhandle = (e) => {
    const tagAddValue = e.target.value;
    this.setState({tagAddValue});
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      tagAddValue:""
    });
  };

  tagSubmit = () => {
    const tag = this.state.tagAddValue;
    let tagPromise = this.props.addTag({tag});
    tagPromise
      .then(value => {
        if(this.props.user.msg){
          message.warning(this.props.user.msg)
        }else{
          message.success('添加tag成功');
        }
        this.handleCancel();
      })
  }

  /* AAA tags add增加按钮模态框  AAA*/  

  /*vvvv tagremove气泡卡片操作  vvv */
  tagPopChoose = (e) => {
    const tagChoose = e.target.innerHTML;
    this.setState({
      tagChoose
    })
  }
  tagRemove = (e) => {
    if(!this.state.tagRemoveStatus){
      this.setState({
        tagRemoveStatus:true
      })
      const removeTag = this.state.tagChoose
      confirm({
        title: `确定要删除这个tag嘛？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '关闭',
        onOk :() => {
          this.setState({
            tagRemoveStatus:false
          })
          let removeTagPromise = this.props.removeTag({removeTag})
          removeTagPromise
            .then(() => {
              if(this.props.user.msg){
                message.warning('删除tag失败了，请稍后重试');
              }else{
                message.success('删除tag成功');
              }
            })
        },
        onCancel: ()=> {
          this.setState({
            tagRemoveStatus:false
          })
        },
      }); 
    }else{
      return ;
    }
  }  

  gotoUsers = (_id) => {
    if(this.props.user.follow.length !== 0){
      this.props.history.push({pathname:'/users/' + _id});
    }
  }

  gotoUsers2 = (_id) => {
    if(this.props.user.fans.length !== 0){
      this.props.history.push({pathname:'/users2/' + _id});
    }
  }

  gotoCards = (_id) => {
    if(this.props.user.notes.length !== 0){
      this.props.history.push({pathname:'/cards/' + _id});
    }
  }

  render () {
    const _id = Cookies.get("_id");
    const {username,sex,nickName, tags, follow, fans, notes} = this.props.user;
    // antd气泡卡片
    // const text = <span>Title</span>;
    const content = (
      <div onClick={this.tagRemove}>
        <Button  type="primary" shape="round" icon='delete'>
        </Button>
    </div>
    );
    if(!username && _id){
      this.props.autoLogin();
    }
    if(username){
      return (
        <div id='personal' className='personal  personal-bscroll-wrapper'>
          <div className='personal-bscroll-container'>
           {/* tagsAdd模态框 */}
          <Modal
          visible={this.state.visible}
          footer={null}
          closable={false}
          // onOk={this.handleOk}
          // onCancel={this.handleCancel}
          okButtonProps={{ disabled: true }}
          cancelButtonProps={{ disabled: true }}
          className='tagsAddModal'
        >
          <Input placeholder="单身可撩、jk爱好者、装机达人" value={this.state.tagAddValue} onChange={this.tagAddhandle} />
         <Button type="primary" shape='circle' icon="delete"  onClick={this.handleCancel}/>
        <Button type="primary" shape='circle'  icon="check" onClick={this.tagSubmit}/>
        </Modal>
          <div className='personal-card clearfix'>
        {/* <div className='personal-avatar'> */}
        <Upload  {...this.avatarProps}>
        <Button>
         
          {
            this.props.user.avatarUrl.slice(-18,-4) ===  'default_avatar' 
              ? 
              <img style={{width:"55px",height:"55px"}} src={this.props.user.avatarUrl} />
               : 
              <img src={this.props.user.avatarUrl} />
          }
        </Button>
        </Upload>

        {/* </div> */}
        <p className='personal-nickName'>
          <span>{nickName}</span> {sex === 'male' ? <MyIcon type="icon-male" /> : <MyIcon type="icon-female" />}
        </p>
        <div className='personal-info'>
      <div className="personal-info-box" onClick={() => {this.gotoUsers(this.props.user._id)}}>
        <p className='personal-info-num'>{follow.length}</p>
        <p className='personal-info-txt'>关注</p>
      </div>
      <div className='personal-line'></div>
      <div className="personal-info-box" onClick={() => {this.gotoUsers2(this.props.user._id)}}>
        <p className='personal-info-num'>{fans.length}</p>
        <p className='personal-info-txt'>粉丝</p>
      </div>
      <div className='personal-line'></div>
      <div className="personal-info-box" onClick={() => {this.gotoCards(this.props.user._id)}}>
        <p className='personal-info-num'>{notes.length}</p>
        <p className='personal-info-txt'>卡片</p>
      </div>
    </div>
  </div>

          <div className='personal-feature'>
          <p className='personal-feature-title'>Feature:</p>
          <div className='personal-feature-Boxs'>
            <div className='personal-feature-Box'>
              <div className="personal-feature-box">
                <MyIcon type="icon-iconzhengli-2" />
              </div>
            </div>
            <div className='personal-feature-Box'>
              <div className="personal-feature-box">
              <MyIcon type="icon-iconzhengli-" />
              </div>
            </div>
            <div className='personal-feature-Box'>
              <div className="personal-feature-box">
              <MyIcon type="icon-iconzhengli-1" />
              </div>
            </div>
            <div className='personal-feature-Box'>
              <div className="personal-feature-box">
              <MyIcon type="icon-tuichu"  onClick={this.showDeleteConfirm}/>
              </div>
            </div>

          </div>
        </div>

        <div className='personal-tags'>
        <p className='personal-tags-title'>Tag:</p>
        <div className='personal-tags-box'>
          {
            tags.length === 0 
              ?
            null
            :
            tags.map((item, index) => {
              return (
                <Popover onClick={this.tagPopChoose} key={index} placement="top"  content={content} trigger="click">
                <span  className='personal-tag'>
                  {item}
                </span>
              </Popover>

              )
            })
          }
          {/* <span className='personal-tag'>
            marvel爱好者
          </span>
          <span className='personal-tag'>
            说唱
          </span>
          <span className='personal-tag'>
            漫画
          </span>
          <span className='personal-tag'>
            前端技术
          </span>
          <span className='personal-tag'>
            美剧
          </span>
          <span className='personal-tag'>
            单身可撩
          </span>
          <span className='personal-tag'>
            社交恐惧症患者
          </span>
          <span className='personal-tag'>
            穷
          </span>
          <span className='personal-tag'>
            DC爱好者
          </span> */}
          <span className='personal-tag'onClick={this.showModal}>
          <Icon type="edit" style={{fontSize:"18px"}} />
          </span>
        </div>
        </div>
          </div>
        </div>
      )
    }else {
      return(
        <div id='personal' className='personal  personal-bscroll-wrapper'>
           <div className='personal-bscroll-container'>
           <div className='personal-card clearfix'>
                  <div onClick={this.gotoLogin} className='personal-avatar2'>
                      <MyIcon type="icon-iconzhengli-1" />
                  </div>
                  <p onClick={this.gotoLogin} className='personal-nickName'>
                  <span>尚未登入</span>
                  </p>
                  <div className='personal-info'>
              <div className="personal-info-box">
                <p className='personal-info-num'>0</p>
                <p className='personal-info-txt'>关注</p>
              </div>
              <div className='personal-line'></div>
              <div className="personal-info-box ">
                <p className='personal-info-num'>0</p>
                <p className='personal-info-txt'>粉丝</p>
              </div>
              <div className='personal-line'></div>
              <div className="personal-info-box">
                <p className='personal-info-num'>0</p>
                <p className='personal-info-txt'>卡片</p>
              </div>
                  </div>
                </div>
                <div className='personal-feature'>
          <p className='personal-feature-title'>Feature:</p>
          <div className='personal-feature-Boxs'>
            <div className='personal-feature-Box'>
              <div onClick={this.gotoLogin} className="personal-feature-box">
                <MyIcon type="icon-iconzhengli-2" />
              </div>
            </div>
            <div className='personal-feature-Box'>
              <div onClick={this.gotoLogin} className="personal-feature-box">
              <MyIcon type="icon-iconzhengli-" />
              </div>
            </div>
            <div className='personal-feature-Box'>
              <div onClick={this.gotoLogin} className="personal-feature-box">
              <MyIcon type="icon-iconzhengli-1" />
              </div>
            </div>
            <div className='personal-feature-Box'>
              <div onClick={this.gotoLogin} className="personal-feature-box">
              <MyIcon type="icon-tuichu-copy" />
              </div>
            </div>

          </div>
        </div>

        <div className='personal-tags' >
        <p className='personal-tags-title'>Tag:</p>
        <div className='personal-tags-box'>
          <span className='personal-tag'>
            兴趣
          </span>
          <span className='personal-tag'>
            爱好
          </span>
          <span className='personal-tag'>
            愿望
          </span>
          <span className='personal-tag'>
            心情
          </span>
          <span className='personal-tag'>
            标签
          </span>
        </div>
        </div>
           </div>
        </div>
      )
    }
  }
}

export default connect(
  state => ({user:state.user}),
  {autoLogin,   account_clear, addTag, removeTag}
)(Personal)