import React, {Component} from 'react';
import {Icon} from 'antd';
import {withRouter} from 'react-router-dom';
import pubSub from 'pubsub-js';

import './nav.css';

// antd中使用iconfont图标引入方法
const MyIcon = Icon.createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_1368816_a7lhoitsitr.js', // 在 iconfont.cn 上生成
});

const initState = {
  home:'icon-home',
  options:"icon-options-copy",
  edit:'icon-edit-copy',
  personal:'icon-personal-copy'
}

class Nav extends Component {

  state = {
    home:'icon-home2-copy',
    options:"icon-options-copy",
    edit:'icon-edit-copy',
    personal:'icon-personal-copy',
    navStatus:'userFlex'
  }

  componentDidMount(){
    if(this.props.location.pathname.slice(0, 5) === '/user' || this.props.location.pathname.slice(0, 6) === '/users' 
        || this.props.location.pathname.slice(0, 6) === '/cards' || this.props.location.pathname.slice(0, 5) === '/card'
        ){
      this.setState({
        navStatus:'userNone'
      })
    }
    pubSub.subscribe("nav",(msg, pathname) => {
      this.setState(initState);
      this.change(pathname);
      // console.log(pathname);
    })
    this.setState(initState);
    let {pathname} = this.props.location;
    this.change(pathname);
  }

   goto = (num) => {
     this.setState(initState);
    switch(num){
      case 1 : {
        this.props.history.replace('/');
        this.setState({
          home:'icon-home2-copy'
        })
        break;
      }
      case 2 : {
        this.props.history.replace('/options')
        this.setState({
          options:'icon-options2-copy'
        })
        break;
      }
      case 3 : {
        this.props.history.replace('/edit')
        this.setState({
          edit:'icon-edit2-copy'
        })
        break;
      }
      case 4 : {
        this.props.history.replace('/personal')
        this.setState({
          personal:'icon-personal2-copy'
        })
        break;
      }
      default :
        return ;
    }
  }

  change = (pathname) => {
    switch(pathname) {
      case '/' : {
        this.setState({
          home:'icon-home2-copy',
          navStatus:'userFlex'
        })
        break;
      }
      case '/options' : {
        this.setState({
          options:'icon-options2-copy',
          navStatus:'userFlex'
        })
        break;
      }
      case '/edit' : {
        this.setState({
          edit:'icon-edit2-copy',
          navStatus:'userFlex'
        })
        break;
      }
      case '/personal' : {
        this.setState({
          personal:'icon-personal2-copy',
          navStatus:'userFlex'
        })
        break;
      }
      case '/user' : {
        this.setState({
          navStatus:'userNone'
        })
      }
      case '/users' : {
        this.setState({
          navStatus:'userNone'
        })
      }
      case '/users2' : {
        this.setState({
          navStatus:'userNone'
        })
      }
      case '/cards' : {
        this.setState({
          navStatus:'userNone'
        })
      }
      case '/card' : {
        this.setState({
          navStatus:'userNone'
        })
      }
      // default : {
      //   this.setState({
      //     personal:'icon-home2-copy'
      //   })
      // }
    }
  }
  
  render () {
    const {
      home,
      options,
      edit,
      personal,
      navStatus
    } = this.state;

    return (
      <div className='nav' id={navStatus}>
        
      <div className="nav-box" onClick = {() => this.goto(1)} ><MyIcon type={home} /></div>
       {/* <div className="nav-box" onClick = {() => this.goto(2)} ><MyIcon type={options} /></div> */}
       <div className="nav-box" onClick = {() => this.goto(3)}> <MyIcon type={edit} /></div>
       <div className="nav-box" onClick = {() => this.goto(4)}> <MyIcon type={personal} /></div>
      </div>

    )
  }
}

export default withRouter(Nav);