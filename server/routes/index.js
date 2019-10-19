var express = require('express');
var router = express.Router();
var md5 = require('md5');

var {
  AccountModel,
  NoteModel,
  // CommentModel,
} = require('../db/index');
var filter = {password:0, __v:0}

let multer = require('multer');
let fs = require("fs");
let path = require("path");
var sd = require('silly-datetime');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/register",function(req, res){ 
  const {nickName, username, sex} = req.body;   
  const password = md5(req.body.password);
  const obj = {
    nickName,
    username,
    password,
    sex,
    tags:[]
  }
  // //判断后存入数据库
  AccountModel.findOne({username},function(err, doc){
    if(doc){
      res.send({code:0,data:"非常棒的用户名哦，但是已经被人抢先了，再想一个吧🙊"});
    }else{
      new AccountModel(obj).save(function(err, doc){
        if(!err){
          res.cookie("_id",doc._id,{maxAge:1000*60*60*24*3})
          res.send({code:1,data:doc});
        }else{
          res.send({code:0,data:"出问题了，请重试🙊"});
        }
      })
    }
  })
})

router.post('/login', function(req, res){
  const {username} = req.body;
  const password = md5(req.body.password);
  AccountModel.findOne({username}, function(err, doc){
    if(!doc){
      // 账号不存在
      res.send({code:0, data:"该账户不存在噢🙊"});
    }else if(doc.password !== password){
      res.send({code:0, data:"密码不正确噢亲🙊"});
    }else{
      res.cookie("_id",doc._id,{maxAge:1000*60*60*24*3});
      res.send({code:1, data:doc})
    }
  })
})

router.get("/autoLogin",function(req, res){
  const _id = req.cookies._id;
  AccountModel.findOne({_id},filter,function(err, doc){
    if(!doc){
      res.send({code:0,data:"出错了，请刷新重试🙊"});
    }else{
      res.send({code:1,data:doc});
    }
  })
})

router.get("/recommend", function(req, res){
  AccountModel.countDocuments({},function(err, count){
    let origin = Math.round(Math.random() * (count - 4));
    AccountModel.find({}).limit(4).skip(origin).exec((err, docs) => {
      if(!err){
        res.send({code:1, data:docs});
      }else{
        res.send({code:0, data:'Something Wrong!'});
      }
    });
  });
})

router.post('/avatarUpload', multer({
  //设置文件存储路径
  dest: 'public/images' //upload文件如果不存在则会自己创建一个。
  }).single('file'), function (req, res, next) {
  if (req.file.length === 0) { //判断一下文件是否存在，也可以在前端代码中进行判断。
  res.render("error", {message: "上传文件不能为空！"});
  return
  } else {
  let file = req.file;
  let fileInfo = {};
  let _id = req.cookies._id;
  let time=sd.format(new Date(), 'YYYY-MM-DD-HH-mm');

  fs.renameSync('./public/images/' + file.filename, './public/images/'  + _id + time + file.originalname);//这里修改文件名字，比较随意。
  // 获取文件信息
  fileInfo.mimetype = file.mimetype;
  fileInfo.originalname = file.originalname;
  fileInfo.size = file.size;
  fileInfo.path = file.path;
    // 设置响应类型及编码
    res.set({
      'content-type': 'application/json; charset=utf-8'
      });
  AccountModel.updateOne({_id},{$set:{avatarUrl:`http://localhost:4000/images/${_id + time + file.originalname}`}},function(err, doc){
    if(!err){
      res.send({code:1,data:'上传成功'});
    }
  })  
  // res.end("上传成功！");
  }
  });

router.post('/note', function(req, res){
  const data = req.body;
  const _id = req.cookies._id;

  // new NoteModel(data).save(async function(err, doc){
    NoteModel.create(data,  function(err, doc){
      if(!err){
         AccountModel.findOne({_id},function(err, user){
          let notes = null;
          notes = user.notes;
          notes.unshift(doc._id);
          AccountModel.findByIdAndUpdate({_id}, {$set:{notes}},function(err, doc){});
        })
        // notes.push(doc._id);
        res.send({code:1,data:doc});
      }else{
        res.send({code:0,data:"发布失败，请稍后重试"})
      }
    })
  // })
})

router.post('/noteImgsUpload', multer({
  //设置文件存储路径
  dest: 'public/noteImages' //upload文件如果不存在则会自己创建一个。
  }).single('file'), function (req, res, next) {
  if (req.file.length === 0) { //判断一下文件是否存在，也可以在前端代码中进行判断。
  res.render("error", {message: "上传文件不能为空！"});
  return
  } else {
  let file = req.file;
  let fileInfo = {};
  let _id = req.cookies._id;
  let time=sd.format(new Date(), 'YYYY-MM-DD-HH-mm');

  fs.renameSync('./public/noteImages/' + file.filename, './public/noteImages/'  + _id + time + file.originalname);//这里修改文件名字，比较随意。
  // 获取文件信息
  fileInfo.mimetype = file.mimetype;
  fileInfo.originalname = file.originalname;
  fileInfo.size = file.size;
  fileInfo.path = file.path;
    // 设置响应类型及编码
    res.set({
      'content-type': 'application/json; charset=utf-8'
      });
  // AccountModel.updateOne({_id},{$set:{avatarUrl:`http://localhost:4000/images/${_id + file.originalname}`}},function(err, doc){
  //   if(!err){
  //     res.send({code:1,data:'上传成功'});
  //   }
  // })  
  res.end(_id + time + file.originalname);
  }
  });

  router.get("/getNotes", function(req, res){

    NoteModel.find({}).lean().sort({_id:-1}).exec((err, docs) => {
      if(!docs){
        res.send({code:0,data:"Somethings worng"})
      }
      const result = docs.map(async (item, index) => {
        await AccountModel.findOne({_id:item.from_id},(err, doc) => {
          if(!doc){
            return ;
          }
          item.avatarUrl = doc.avatarUrl;
          item.nickName = doc.nickName;

          item.comment = item.comment.length;
        })
          return item;
      })

      const p = Promise.all(result);

      p.then((value) => {
        res.send({code:1, data:value});
      })
        .catch((err) => {
          res.send({code:0, data:"获取notes失败！刷新再试"});
        })
    })
})

router.post("/like",async function(req, res){
  const {note_id} = req.body;
  const _id = req.cookies._id;
  let like = null;
  await NoteModel.findOne({_id:note_id}, null, {lean:true},function(err,doc){
    if(!err){
      like =  doc.like;
    }
  })
  like.push(_id);
  NoteModel.updateOne({"_id":note_id},{$set:{like}},function(err, doc){
    if(!err){
      res.send({code:1});
    }else{
      res.send({code:0});
    }
  })
})

router.post('/unlike',async function(req, res){
  const {note_id} = req.body;
  const _id = req.cookies._id;
  let like = null;
  await NoteModel.findOne({_id:note_id}, null, {lean:true},function(err,doc){
    if(!err){
      like =  doc.like;
    }
  })
  like.splice(like.indexOf(note_id), 1);
  NoteModel.updateOne({"_id":note_id},{$set:{like}},function(err, doc){
    if(!err){
      res.send({code:1});
    }else{
      res.send({code:0});
    }
  })
})

router.post('/addTag', async function(req, res){
  const tag = req.body;
  const _id = req.cookies._id;
  let tags = null;
  await AccountModel.findOne({_id}, function(err, doc){
    if(!err){
      tags = doc.tags;
    }else{
      res.send({code:0, data:"Something wrong"});
    }
  })
  tags.push(tag.tag);
  AccountModel.findByIdAndUpdate({_id},{$set:{tags}},{new:true}, function(err, doc){
    if(err){
      res.send({code:0, data:"添加tag失败，请稍后重试"});
    }else{
      res.send({code:1, data:doc});
    }
  })
})

router.post('/removeTag',async function(req, res){
  const {removeTag} = req.body;
  const _id = req.cookies._id;
  let tags = null;
  await AccountModel.findOne({_id}, function(err, doc){
    if(!err){
      tags = doc.tags;
    }else{
      res.send({code:0, data:"Something wrong"});
    }
  })

  tags.splice(tags.indexOf(removeTag), 1);
  AccountModel.findByIdAndUpdate({_id},{$set:{tags}},{new:true, useFindAndModify:false}, function(err, doc){
    if(err){
      res.send({code:0, data:"删除tag失败，请稍后重试试"});
    }else{
      res.send({code:1, data:doc});
    }
  })
})

router.post('/user', function(req, res){
  const {id} = req.body;
  AccountModel.findOne({_id:id},function(err, doc){
    if(!err){
      res.send({code:1, data:doc});
    }else{
      res.send({code:0, data:"获取用户信息失败，请稍后再试试"})
    }
  })
})

router.post('/follow', async function(req, res){
  const {follow_id} = req.body; // 关注对象
  const _id = req.cookies._id; // 当前用户
  let follow = null;
  let fans = null;
  await AccountModel.findOne({_id}, function(err, doc){
    if(!err){
      follow = doc.follow;
    }else{
      res.send({code:0, data:"关注该同学失败，请稍后再试试"})
    }
  })
  await AccountModel.findOne({_id:follow_id}, function(err, doc){
    // if(!err){
      fans = doc.fans;
    // }else{
    //   res.send({code:0, data:"关注该同学失败，请稍后再试试"})
    // }
  })
  fans.push(_id);
  follow.push(follow_id);
  AccountModel.findByIdAndUpdate({_id}, {$set:{follow}},{new:true}, function(err, doc){
    if(!err){
       AccountModel.findByIdAndUpdate({_id:follow_id}, {$set:{fans}},  function(err, doc){  })
          res.send({code:1, data:doc});
    }else{
      res.send({code:0, data:"关注该同学失败，请稍后再试试"})
    }
  })
})

router.post('/unFollow', async function(req, res){
  const {unFollow_id} = req.body;
  const _id = req.cookies._id;
  let follow = null;
  let fans = null;
  await AccountModel.findOne({_id}, function(err, doc){
    if(!err){
      follow = doc.follow;
    }else{
      res.send({code:0, data:"取消关注该同学失败，请刷新再试试"})
    }
  })
  await AccountModel.findOne({_id:unFollow_id}, function(err, doc){
    // if(!err){
      fans = doc.fans;
    // }else{
    //   res.send({code:0, data:"取消关注该同学失败，请刷新再试试"})
    // }
  })
  if(follow.indexOf(unFollow_id) === -1 || fans.indexOf(_id) === -1){
    res.send({code:0, data:"取消关注该同学失败，请刷新再试试"})
  }
  follow.splice(follow.indexOf(unFollow_id), 1);
  fans.splice(fans.indexOf(_id), 1);
  AccountModel.findByIdAndUpdate({_id}, {$set:{follow}},{new:true},  function(err, doc){
    if(!err){
      AccountModel.findByIdAndUpdate({_id:unFollow_id}, {$set:{fans}},  function(err, doc){})
      res.send({code:1, data:doc});
    }else{
      res.send({code:0, data:"取消关注该同学失败，请稍后再试试"})
    }
  })
})

router.post("/getUsersObjs", function(req, res){
  const _id = req.body.id;
  AccountModel.findOne({_id}, null, {lean:true}, function(err, doc){
    if(!err){
      const result = doc.follow.map(async (item, index) => {
        await AccountModel.findOne({_id:item},  null, {lean:true},function(err, doc){
          item = doc;
        })
        return item;
      })
      const allP = Promise.all(result);
      allP
        .then((data) => {
      res.send({code:1, data});        
      })
        .catch(() => {
          res.send({code:0, data:"获取关注列表失败了哦，请重新再试试"});
        })
    }else{
      res.send({code:0, data:"获取关注列表失败了哦，请重新再试试"});
    }
  })
})

router.post("/getUsers2Objs", function(req, res){
  const _id = req.body.id;
  AccountModel.findOne({_id}, null, {lean:true}, function(err, doc){
    if(!err){
      const result = doc.fans.map(async (item, index) => {
        await AccountModel.findOne({_id:item},  null, {lean:true},function(err, doc){
          item = doc;
        })
        return item;
      })
      const allP = Promise.all(result);
      allP
        .then((data) => {
      res.send({code:1, data});        
      })
        .catch(() => {
          res.send({code:0, data:"获取粉丝列表失败了哦，请重新再试试"});
        })
    }else{
      res.send({code:0, data:"获取粉丝列表失败了哦，请重新再试试"});
    }
  })
})

router.post('/getCards', function(req, res){
  const _id = req.body.id;
  AccountModel.findOne({_id}, null, {lean:true}, function(err, doc1){
    if(!err){
      const result = doc1.notes.map(async (item, index) => {
        await NoteModel.findOne({_id:item},  null, {lean:true},function(err, doc){
          item = doc;
          item.avatarUrl = doc1.avatarUrl;
          item.nickName = doc1.nickName;
        })
        return item;
      })
      const allP = Promise.all(result);
      allP
        .then((data) => {
      res.send({code:1, data});        
      })
        .catch(() => {
          res.send({code:0, data:"获取卡片列表失败了哦，请重新再试试"});
        })
    }else{
      res.send({code:0, data:"获取卡片列表失败了哦，请重新再试试"});
    }
  })
})

router.post("/getCard", function(req, res){
    const _id =  req.body.id;
    NoteModel.findOne({_id}, null, {lean:true}, function(err, doc1){
      if(!err){
        AccountModel.findOne({_id:doc1.from_id}, (err, doc) => {
          if(!doc){
            return ;
          }
          doc1.avatarUrl = doc.avatarUrl;
          doc1.nickName = doc.nickName;
          res.send({code:1, data:doc1});
        })
      }else{
        res.send({code:0, data:"获取卡片详情失败了哦，请重新再试试"});
      }
    })
  })

  router.post("/comment",async  function(req, res){
    const obj = req.body;
    console.log(obj);
    let comment = [];
    await NoteModel.findOne({_id:obj.to_id}, function(err, doc){
      if (!err){
        comment = doc.comment;
      }else{
        res.send({code:0, data:"发布评论失败了哦，等会再试试呀"}) ;
      }
    })    
    comment.unshift(obj);
    console.log(comment);
    NoteModel.findByIdAndUpdate({_id:obj.to_id}, {$set:{comment}}, function(err, doc){
      if(!err){
        res.send({code:1, data:"发布评论成功!"});
      }else{
        res.send({code:0, data:"发布评论失败了哦，等会再试试呀"}) ;
      }
    })
  })

  router.post("/comments", function(req, res){
    const {note_id} = req.body;
    NoteModel.findOne({_id:note_id}, null, {lean:true}, function(err, doc){
      if(!err){
        // doc = [
        //   {user1},
        //   {user2},
        //   {user3},
        // ]
          let comments = doc.comment.map(async (item, index) => {
          await AccountModel.findOne({_id:item.from_id}, function(err, userDoc){
            item.avatarUrl = userDoc.avatarUrl;
            item.nickName = userDoc.nickName;
          })
        })
        const commentsP = Promise.all(comments);
        commentsP.then(() => {
          res.send({code:1, data:doc.comment});
        })
      }else{
        res.send({code:0, data:"发布评论失败了哦，等会再试试呀"}) ;
      }
    })
  })

module.exports = router;