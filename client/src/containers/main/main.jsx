import React,{Component} from 'react';
import { connect} from 'react-redux';
import Cookies from 'js-cookie';
import { Button , Card, Icon, Avatar, Skeleton, message, Modal} from 'antd';
import BScroll from 'better-scroll';
import pubSub from 'pubsub-js';


import {
  autoLogin,
  recommend,
  recommend_clear,
  getNotes
} from '../../redux/actions'

import './main.css';
import {
  reqLike,
  reqUnLike
} from '../../api/index'
// antd中使用iconfont图标引入方法
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1368816_a7lhoitsitr.js', // 在 iconfont.cn 上生成
});

const { Meta } = Card;
class Main extends Component {
  
  state = {
    routeArr : ['login','register','main','chatroom'],
    loading:true,
    refreshStatus:"下拉刷新",
    visible: false,
    postImgEnlarge : "",
    top:0,
  }


  componentWillMount(){
    // 当state中没有recommend_users数据时再发送请求
    if(this.props.recommend_users.length === 0){
      this.props.recommend();
    }

    // 当state中没有notes数据时再发送请求
    // if(this.props.recommend_users.length === 0 ){
    // 由于点赞设置，直接每次重新获取getnotes()
      this.props.getNotes();
    // }


  }

  componentDidMount(){


    pubSub.publish("nav","/");

    const card = this.refs.card;

     this.scroll = new BScroll(card,{
      scrollY:false,
      scrollX: true,
      click: false
  })

  const refresh = () => {
    if(this.state.refreshStatus === '下拉刷新'){
      this.setState({
        refreshStatus:"loading"
      })
      message.loading('刷新数据中');
      setTimeout(() => {
        this.setState({
          refreshStatus:"下拉刷新"
        })
      }, 2500);
    }

    // Dismiss manually and asynchronously
    // setTimeout(hide, 2500);
  };

    const mainWrapper = document.querySelector(".main-wrapper");
    this.rootScroll = new BScroll(mainWrapper,{
      scrollY:true,
      click:true,
      pullDownRefresh : {
        threshold:40,
        stop:0
      }
    })

    this.rootScroll.on('pullingDown', () => {
      this.rootScroll.finishPullDown();
      refresh();
    })

    //绑定touchEnd方法，每次滚动结束后记录y轴，用于路由切换后的top记录
    this.rootScroll.on('touchEnd', (location) => {

     let top =  document.querySelector(".card-box").getBoundingClientRect().top
      // // 通过split分解字符串形成数组，来解决better-scroll的bug
      // //不正常现象1
      // location.y = location.y + "";
      // let y = location.y.split('-');
      // console.log(y);
      // console.log(Math.floor(y[1]));
      // console.log(y[1].split("."))
      // if(y[1].split(".").length>2){

      //   // 不正常现象2
      //   y = y[1].split(".")[0];
      // }else{
      //   y = y[1];
      // }
      // console.log(y);
      //  sessionStorage.setItem("locationY",`-${Math.floor(y)}`);
      console.log(top);
      sessionStorage.setItem("locationY",top);
    })

    if(sessionStorage.getItem("locationY") && this.rootScroll){
      console.log(`获得的sessionStorage${typeof sessionStorage.getItem("locationY")}`)
      this.rootScroll.scrollTo(0,Number(sessionStorage.getItem("locationY")),0)
    }


  }

  recommend_refresh = () => {
    this.props.recommend_clear();
    this.props.recommend();
    this.scroll.scrollTo(0,0,800);
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

  comment = () => {
    const {username} = this.props.user;
    if(!username) {
      this.props.history.push('/login');
    }
  }

  share = () => {
    const {username} = this.props.user;
    if(!username) {
      this.props.history.push('/login');
    }
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

  postImgEnlarge = (item, e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      postImgEnlarge:item
    })
    this.showModal();
  }

  toUser = (_id, e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.history.push({pathname:'/user/' + _id});
  }

  gotoCard = (_id) => {
    this.props.history.push({pathname:'/card/' + _id});
  }

  render () {
    const {username} = this.props.user;
    const {recommend_users, notes} = this.props;
    const arr = [0,1,2,3];
    const _id = Cookies.get("_id");
    const { loading } = this.state;

    if(!username && _id){
      this.props.autoLogin();
    }
    if(notes == []){
      return null;
    }else{

    return (
     <div id="main" className='main-wrapper'>
       <div className='main-container'>

      <div className='main-refresh-txt'>
        <img src="/loading.gif" alt=""/><p>{this.state.refreshStatus}</p>
      </div>
      
       <div className='recommend'>
       <p className='recommend-txt1'>Classroom:</p>
         <p className='recommend-txt2'>推荐小伙伴:</p>
         <div  ref='card' className='card-box'>
         <div className='card-container'>
           {             
             recommend_users.length === 0 ||recommend_users.msg ? (
              arr.map((item,index) => {
                return (
                      <div className='card' key={index}>
                        <Skeleton loading={loading} avatar active>
                        <div className='card-content'>
                         
                        </div>
                      </Skeleton>
                      </div>
                )
              })
             ) : (
               recommend_users.map((item, index) => {
                 return (
                      <div className='card' key={index} onClick={(e) => this.toUser(item._id, e)}>
                      <div className='card-content'>
                        <img src={item.avatarUrl} alt=""/>
                        <span className='card-content-txt card-content-txt1'><span className='recommend-nickName'>{item.nickName}</span>&nbsp;{item.sex === 'male' ? <MyIcon type="icon-male" /> : <MyIcon type="icon-female" />}</span> 
                        <div className='card-tag-container'>
                          {
                            item.tags.length === 0 
                            ?
                            <span className='personal-tag'>
                              萌新入驻
                            </span>
                            :
                            item.tags.map((item, index) => {
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
                 )
               })
             )
           }
          <div onClick={this.recommend_refresh} className='recommend-refresh'>
          <Icon type="sync" />
          </div>
            </div>
         </div>
       </div>

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


       <div className='post' >
       <p className='post-txt1'>动态:</p>
           <div className='post-box' ref='post'>
             <div className='post-container'>

      {
        
        notes.length === 0
         ?
        Array.from({length:10},() => 0).map((item,index) => {
          return (
            <Skeleton key={index} loading={loading} avatar active>
            <div className='card-content'>
             
            </div>
          </Skeleton>
          )
        })
       :
        notes.map((item, index) => {
          return (
            <div onClick={() => {this.gotoCard(item._id)}} key={index} className='post-card'>
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
              <div className='post-avatar'onClick={(e) => this.toUser(item.from_id, e)}>

              <img src={item.avatarUrl} alt=""/>
              </div>
            <span onClick={(e) => this.toUser(item.from_id, e)}>{item.nickName}</span>
            </div>
            <div className='post-handles'>
                <div className="post-handle" onClick={(e) => this.like(item._id, e)}>
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
                <div className="post-handle" onClick={() => {this.gotoCard(item._id)}}><MyIcon type="icon-comment" /><span>{item.comment}</span></div>
                <div className="post-handle" onClick={this.share}><MyIcon type="icon-share" /><span>{item.share}</span></div>
            </div>
        </div>
          )
        })
      }


            {/* <div className='post-card'>
            <div className='tag'>
                    hot  <MyIcon type="icon-hot2-copy" />
                </div>
                <div className='post-content'>
                呜啦啦啦，Hello World!
                </div>

                <div className='post-img-Box'>
                  <div className='post-img-box'>
                      <img src="http://localhost:4000/images/a.jpg" alt=""/>
                  </div>

                  <div className='post-img-box'>
                  <img src="http://localhost:4000/images/b.jpg" alt=""/>
                  </div>

                  <div className='post-img-box'>
                  <img src="http://localhost:4000/images/c.jpg" alt=""/>
                  </div>
                </div>

                <div className='post-avatar-box'>
                  <div className='post-avatar'>
                  <img src="http://localhost:4000/images/batman.jpg" alt=""/>
                  </div>
                <span>nickName</span>
                </div>
                <div className='post-handles'>
                    <div className="post-handle"><MyIcon type="icon-like" /><span>153</span></div>
                    <div className="post-handle"><MyIcon type="icon-comment" /><span>48</span></div>
                    <div className="post-handle"><MyIcon type="icon-share" /><span>6</span></div>
                </div>
            </div>
             */}
            </div>
          </div>
       </div>
      </div>
     </div>
    )
  }

  }
}

export default connect(
  state => ({user:state.user,recommend_users:state.recommend, notes:state.notes}),
  {autoLogin, recommend, recommend_clear,getNotes}
)(Main);