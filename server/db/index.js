let mongoose = require('mongoose');
const dbUrl = 'mongodb://127.0.0.1/wall';

mongoose.connect(dbUrl, {useUnifiedTopology: true});

mongoose.connection.once('open', function(err){
  if(!err){
    console.log('数据库连接成功🙉')
  }else{
    console.log('数据库连接失败🙊');
  }
})
let Schema = mongoose.Schema;


// 用户信息collection
let accountSch = new Schema({
  nickName:String,
  username:String,
  password:String,
  sex:{
    type:String,
    default:'female'
  },
  avatarUrl:{
    type:String,
    default:"http://localhost:4000/images/default_avatar.png"
  },
  tags:Array,
  follow:Array,
  fans:Array,
  notes:Array,
})
const accountModel = mongoose.model('accounts', accountSch);

// post卡片collection
let noteSch = new Schema({
  from_id:String,
  date:String,
  avatar_url:String,
  imgs_url:Array,
  content:String,
  like:Array,
  comment:Array,
  share:Number,
})
const noteModel = mongoose.model('notes', noteSch);

// //卡片的评论的表格
// let commentsSch = new Schema({
//   //to_id可能是卡片的id,也可能是某一个comment的id
//   to_id:String,
//   from_id:String,
//   date:String,
//   avatar_url:String,
//   content:String,
//   //通过type判断该comment是对当前卡片的评论，还是对评论的评论
//   //type为true则是对卡片的直接评论
//   //type为false是对评论的评论或者评论的评论的评论...
//   type:Boolean,

// })
// const commentModel = mongoose.model('comments', commentsSch);

exports.AccountModel = accountModel;
exports.NoteModel = noteModel;
// exports.CommentModel = commentModel;