import React, {Component} from 'react';
import BScroll from 'better-scroll';
import pubSub from 'pubsub-js';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import {Icon, Skeleton, Button, Modal,Input, message} from 'antd';


import{
  getCardObj,
  autoLogin,
  comment,
  comments,
}from '../../redux/actions';
import {
  reqLike,
  reqUnLike
} from '../../api/index'
import './card.css'

// antd中使用iconfont图标引入方法
const MyIcon = Icon.createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_1368816_anek3qab0ai.js', // 在 iconfont.cn 上生成s
});
const { TextArea } = Input;

class Card extends Component {
  state = {
    postImgEnlarge : "",
    visible:false,
    textAreaValue: '',
  }

  componentDidMount(){
    this.props.getCardObj(this.props.match.params);
    // 发布消息,nav隐藏 
    pubSub.publish("nav","/card");
    //
    const card = document.getElementById("card");

    this.cardScroll = new BScroll(card, {
      scrollY:true,
      click: true
    })

    // 此处使用comments函数进行评论数据的后台获取
    const obj = {
      note_id : this.props.match.params.id
    };
    this.props.comments(obj);
}

goBack = () => {
  this.props.history.goBack();
}

onChange = ({ target: { value } }) => {
  this.setState({ textAreaValue:value });
};

postImgEnlarge = (item, e) => {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
  this.setState({
    postImgEnlarge:item
  })
  this.showModal();
}

showModal = () => {
  this.setState({
    visible: true,
  });
};

hideModal = () => {
  this.setState({
    visible: false,
  });
};
toUser = (_id, e) => {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
  this.props.history.push({pathname:'/user/' + _id});
}

commentSubmit = () => {
  const obj = {
    to_id:this.props.match.params.id, // 这个ID是当前动态卡片的ID
    from_id:this.props.user._id,
    content:this.state.textAreaValue,
    like:[],
    comments:[],
    type:true
  }
  const commentP = this.props.comment(obj);
  commentP
    .then(value => {
    if(!this.props.commentState.msg){
      message.success(this.props.commentState);
      this.setState({
        textAreaValue:""
      })
          // 此处使用comments函数进行评论数据的后台获取
    const obj = {
      note_id : this.props.match.params.id
    };
    this.props.comments(obj);
    }else{
      message.warning(this.props.commentState.msg);
    }
  })
  .catch(err => {
    message.warning('发布评论没有成功哦，请再试一试');
  })
}

like = (note_id, e) => {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();

  const {username, _id} = this.props.user;

  // 获取note_id对应的state中的like数组
  // const currNoteLike = this.props.notes.filter((item, index) => {
  //   return item._id === note_id;
  // })[0].like;
  // const index = this.props.notes.indexOf(currNoteLike);
  if(!username) {
    this.props.history.push('/login');
  }

  // 进行了dom操作，哈哈，没想出除了dom操作以外。
  // 通过对i dom的style判定
  const likeDom = this.refs[note_id];
  const i = likeDom.querySelector('i');
  function iClassBack(i){
    setTimeout(() => {
      i.className = 'anticon anticon-like';
    },1000);
  }
  
    if(!i.style.color){
      i.className += 'anticon anticon-like like-animation';
    // 该用户没有赞过该帖,
    // 点赞后，修改like svg图标的fill值为黄色,like数++，并发送请求

    i.style.color = 'rgb(255,255,0)';
    reqLike({note_id});
    likeDom.querySelector('span').innerHTML++;
    iClassBack(i)
  }else{
    i.className += 'anticon anticon-like like-animation2';
    // 该用户已经点过赞，取消点赞。
    i.style.color = '';
    reqUnLike({note_id});
    likeDom.querySelector('span').innerHTML--;
    iClassBack(i)
  }
}
  
  render(){
    console.log(this.props.commentsState);
    const item = this.props.card;
    const {username} = this.props.user;
    const _id = Cookies.get("_id");
    const { textAreaValue } = this.state;
    if(!username && _id){
      this.props.autoLogin();
    }
    if(!Object.keys(item).length){
      return (
        <div id='card' className='card-wrapper2'>
        <div className='card-container2'>
          </div>
          </div>
      );
    }else{
    return (
      <div id='card' className='card-wrapper2'>
        <div className='card-container2'>

        <Modal
          title=""
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText=""
          cancelText=""
          footer={null}
          closable={false}
          className='postImgEnlarge'
        >
        <img className='postImgEnlarge' src={this.state.postImgEnlarge} alt=""/>
        </Modal>

            <div className='card-header'>
            <div className='tag'>
                hot  <MyIcon type="icon-hot2-copy" />
            </div>

            <div className='post-content'>
            {item.content}
            </div>
            <div className='post-img-Box'>

            {
              item.imgs_url.length !== 0 ? (
                item.imgs_url.map((item, index) => {
                  return (
                    <div onClick={(e) => this.postImgEnlarge(item, e)} key={index} className='post-img-box'>
                        <img src={item} alt=""/>
                    </div>
                  )
                })
              ) : null
            }
            
            </div>

            <div className='post-avatar-box'>
              <div className='post-avatar'onClick={(e) => this.toUser(this.props.user._id, e)}>

              <img src={item.avatarUrl} alt=""/>
              </div>
            <span onClick={() => this.toUser(this.props.user._id)}>{item.nickName}</span>
            </div>

            <div className='post-handles'>
                <div className="post-handle" onClick={(e) => this.like(item._id, e)}>
                {item.like.indexOf(this.props.user._id) === -1 
                  ?
                  <span ref={item._id}>                  
                  <Icon type="like" />
                  <span >{item.like.length}</span>
                  </span>
                  :
                  <span ref={item._id}>
                  <Icon type="like" style={{color:'#FFFF00'}}/>
                  <span >{item.like.length}</span>
                  </span>
                }
                
                </div>
                <div className="post-handle" onClick={this.comment}><MyIcon type="icon-comment" /><span>{item.comment.length}</span></div>
                <div className="post-handle" onClick={this.share}><MyIcon type="icon-share" /><span>{item.share}</span></div>
            </div>

            </div>
            
            <div className='card-comment-tag personal-tag'>
                评论:
            </div>

            <div className='card-comment-box'>
                <div className='card-comment-input'>
                    <TextArea
                      placeholder="在这里发表评论哦～"
                      autosize={{ maxRows: 6 }}
                      value={textAreaValue}
                      onChange={this.onChange}
                    >
                    </TextArea>
                    <Button onClick={this.commentSubmit} size={"large"} className='card-comment-submit' type="primary" shape="circle" icon="message" />

                </div>

                {/* <div className='card-comment'>
                    <div className='post-avatar-box'>
              <div className='post-avatar card-comment-avatar'onClick={(e) => this.toUser(this.props.user._id, e)}>

              <img src={item.avatarUrl} alt=""/>
              </div>
            <span onClick={() => this.toUser(this.props.user._id)}>{item.nickName}</span>
            <div className='card-comment-content'>
                    看到这个动态后又是精神饱满的一天开始啦！！！
                  </div> 
            </div>

            <div className='post-handles'>
                <div className="post-handle" onClick={(e) => this.like(item._id, e)}>
                {item.like.indexOf(this.props.user._id) === -1 
                  ?
                  <span ref={item._id}>                  
                  <Icon type="like" />
                  <span >{item.like.length}</span>
                  </span>
                  :
                  <span ref={item._id}>
                  <Icon type="like" style={{color:'#FFFF00'}}/>
                  <span >{item.like.length}</span>
                  </span>
                }
                
                </div>
                <div className="post-handle" onClick={this.comment}><MyIcon type="icon-comment" /><span>{item.comment.length}</span></div>
                <div className="post-handle" onClick={this.share}><MyIcon type="icon-share" /><span>{item.share}</span></div>
            </div>
                </div> */}

                {
                  // 三元运算符确认是否渲染comments列表
                  this.props.commentsState.length === 0
                  ?
                  <p style={{textAlign:"center",margin:"30px"}}>猜猜谁会来第一个吃螃蟹</p>
                  :
                  this.props.commentsState.map((item, index) => {
                    return (
                      <div key={index} className='card-comment'>
                      <div className='post-avatar-box'>
                <div className='post-avatar card-comment-avatar'onClick={(e) => this.toUser(this.props.user._id, e)}>
  
                <img src={item.avatarUrl} alt=""/>
                </div>
              <span onClick={() => this.toUser(this.props.user._id)}>{item.nickName}</span>
              <div className='card-comment-content'>
                      {item.content}
                    </div> 
              </div>
  
              <div className='post-handles'>
                  <div className="post-handle" >
                  {/* 
                    onClick={(e) => this.like(item._id, e)}                  
                  {item.like.indexOf(this.props.user._id) === -1 
                    ?
                    <span ref={item._id}>                  
                    <Icon type="like" />
                    <span >{item.like.length}</span>
                    </span>
                    :
                    <span ref={item._id}>
                    <Icon type="like" style={{color:'#FFFF00'}}/>
                    <span >{item.like.length}</span>
                    </span>
                  } */}
                  <div className="post-handle" onClick={this.comment}><MyIcon type="icon-like" /><span>*</span></div>
                  
                  </div>
                  <div className="post-handle" onClick={this.comment}><MyIcon type="icon-comment" /><span>*</span></div>
                  <div className="post-handle" onClick={this.share}><MyIcon type="icon-share" /><span>*</span></div>
              </div>
                  </div>
                    )
                  })
                }

            </div>

          </div>
          <Button onClick={this.goBack} id='user-back-btn' shape='circle'  size='large' icon='arrow-left'>
        </Button>
          </div>
    )

  }

  }
}

export default connect(
  state => ({card:state.cardObj, 
                      user:state.user, 
                      commentState:state.comment, 
                      commentsState:state.comments
                    }),
  {getCardObj, autoLogin, comment, comments}
)(Card);