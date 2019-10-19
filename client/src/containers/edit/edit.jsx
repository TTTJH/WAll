import React, {Component} from 'react';
import {Input,Upload, Icon, Modal, message} from 'antd';
import BScroll from 'better-scroll';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import sd from 'silly-datetime';
import pubSub from 'pubsub-js';

import {
  note,
  getNotes,
  autoLogin,//用于用户发布新卡片后personal路由的关注数粉丝数的更新
} from '../../redux/actions'
import './edit.css'

const { TextArea } = Input;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


class Edit extends Component{
  state = {
    value: '',
    previewVisible: false,
    previewImage: '',
    fileList: [],
    editContent:"",
    publishing:false
  };

  componentDidMount(){
    const edit = document.querySelector(".edit-wrapper");

      this.listScroll = new BScroll(edit, {
        scrollY:true,
        click: true
      })
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  gotoLogin = () => {
    this.props.history.push('/login');
  }

  editContentHandle = (e) => {
    const editContent = e.target.value;
    this.setState({editContent});
  }

  publish = () => {
    if(!this.state.publishing && this.state.editContent.trim()){
    this.setState({
      publishing:true
    })
    let imgs_url = [];
    this.state.fileList.map((item,index) => {
      imgs_url.push(`http://localhost:4000/noteImages/${item.response}`);
    })
    const obj = {
      from_id:this.props.user._id,
      date:sd.format(new Date(), 'YYYY-MM-DD HH:mm'),
      imgs_url,
      content:this.state.editContent,
      like:[],
      comment:[],
      share:0
    }
    let notePromise = this.props.note(obj);
    notePromise
      .then(value => {
        console.log(this.props.state_note)
        if(!this.props.state_note.from_id){
          message.warning('很抱歉，发布失败，请稍后再试');
          this.setState({
            publishing:false
          })
        }else{
          this.setState({
            publishing:false
          })
          message.success('发布成功！');
          this.props.autoLogin();
          pubSub.publish("nav","/");
          this.props.getNotes();
          this.props.history.replace('/');
        }
      })
        .catch(err => {
          this.setState({
            publishing:false
          })
          console.log('失败了')
        })

      }    
  }

  render(){
    const { value } = this.state;
    const _id = Cookies.get("_id");
    const { previewVisible, previewImage, fileList } = this.state;
    const {username} = this.props.user;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    if(!username && _id){
      this.props.autoLogin();
    }else if(!username){
      this.gotoLogin();
    }
    return (
      <div className='edit edit-wrapper' id='edit'>
        <div className='edit-container'>
        <p className='edit-title'>Edit:</p>
        <TextArea
          onChange={this.editContentHandle}
          value={this.state.editContent}
          id='textarea'
          style={{resize:"none"}}
          placeholder="记录每一个在轻大的美好瞬间吧🦄"
          autosize={{ minRows: 5, maxRows: 5 }}
        />
      <div className='edit-img-box'>
        <div className="clearfix">
          <Upload
            className='imgUpload'
            action="/noteImgsUpload"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 9 ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </div>  
      <div className='edit-btn' onClick={this.publish}>
        发布
      </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user, state_note:state.note}),
  {note, getNotes,autoLogin}
)(Edit);