import React, {Component} from 'react';
import BScroll from 'better-scroll';
import pubSub from 'pubsub-js';
import {connect} from 'react-redux';
import {Icon, Skeleton, Button } from 'antd';

import './cards.css';
import {
  getCardsObjs,
  autoLogin,
} from '../../redux/actions'

// antd中使用iconfont图标引入方法
const MyIcon = Icon.createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_1368816_anek3qab0ai.js', // 在 iconfont.cn 上生成s
});

class cards extends Component {

  componentDidMount(){
    // 发布消息,nav隐藏 
    pubSub.publish("nav","/cards");
    const cards = document.getElementById("cards");

    this.cardsScroll = new BScroll(cards, {
      scrollY:true,
      click: true
    })
    this.props.getCardsObjs(this.props.match.params)
}

goBack = () => {
  this.props.history.goBack();
}

toUser = (_id) => {
  this.props.history.push({pathname:'/user/' + _id});
}

  render(){
    if(this.props.cardsObjs.length === 0){
      // if(true){
      return (
        <div id='cards' className='cards-wrapper'>
        <div className='cards-content'>
        <Skeleton  avatar active>
      </Skeleton>    
      <Skeleton  avatar active>
      </Skeleton>    
      <Skeleton  avatar active>
      </Skeleton> 
      <Skeleton  avatar active>
      </Skeleton>    
      <Skeleton  avatar active>
      </Skeleton>    
      <Skeleton  avatar active>
      </Skeleton>   
      </div>
        </div>
      )
    }else{
    return (
      // <div style={{height:"100%"}}>
      <div id='cards' className='cards-wrapper'>
        <div className='cards-container'>
          {
            this.props.cardsObjs.map((item, index) => {
              return (
                <div key={index} className='post-card'>
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
                        <div onClick={() => this.postImgEnlarge(item)} key={index} className='post-img-box'>
                            <img src={item} alt=""/>
                        </div>
                      )
                    })
                  ) : null
                }
                
                </div>
    
                <div className='post-avatar-box'>
                  <div className='post-avatar'onClick={() => this.toUser(this.props.user._id)}>
    
                  <img src={item.avatarUrl} alt=""/>
                  </div>
                <span onClick={() => this.toUser(this.props.user._id)}>{item.nickName}</span>
                </div>
                <div className='post-handles'>
                    <div className="post-handle" onClick={() => this.like(item._id)}>
                    {item.like.indexOf(this.props.user._id) === -1 
                      ?
                      <span ref={item._id}>                  
                      {/* <MyIcon  type="icon-like" /> */}
                      <Icon type="like" />
                      <span >{item.like.length}</span>
                      </span>
                      :
                      <span ref={item._id}>
                      {/* <MyIcon type="icon-like2" /> */}
                      <Icon type="like" style={{color:'#FFFF00'}}/>
                      <span >{item.like.length}</span>
                      </span>
                    }
                    
                    </div>
                    <div className="post-handle" onClick={this.comment}><MyIcon type="icon-comment" /><span>48</span></div>
                    <div className="post-handle" onClick={this.share}><MyIcon type="icon-share" /><span>{item.share}</span></div>
                </div>
            </div>
            //     <div onClick={() => {this.toUser(item._id)}} key={index} className='cards-box'>
            //       <div className='cards-content'>
            //         <div className='cards-content-avatar'>
            //           <img src={item.avatarUrl} alt=""/>
            //         </div>
            //          <p className='cards-nickName'>{item.nickName}&nbsp;{item.sex === 'male' ?  <MyIcon type="icon-male" /> :  <MyIcon type="icon-female" />}</p> 
            //       </div>
            //       <div className='personal-info'>
            //       <div className="personal-info-box" >
            //         <p className='personal-info-num'>{item.cards ? item.cards.length : 0}</p>
            //         <p className='personal-info-txt'>关注</p>
            //       </div>
            //       <div className='personal-line'></div>
            //       <div className="personal-info-box ">
            //         <p className='personal-info-num'>5</p>
            //         <p className='personal-info-txt'>粉丝</p>
            //       </div>
            //       <div className='personal-line'></div>
            //       <div className="personal-info-box">
            //         <p className='personal-info-num'>5</p>
            //         <p className='personal-info-txt'>卡片</p>
            //       </div>
            //     </div>
            // </div>      
              )
            })
          }
 

        </div>
        <Button onClick={this.goBack} id='user-back-btn' shape='circle'  size='large' icon='arrow-left'>
        </Button>
      </div>

      // </div>
    )
  }
  }
}
export default connect(
  state => ({cardsObjs:state.cardsObjs, user:state.user}),
  {autoLogin, getCardsObjs}
)(cards);