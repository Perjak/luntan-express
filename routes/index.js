var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var async=require("async");

/* GET home page. */
//主页路由
router.get('/', function(req, res, next) {
  var cookie=req.cookies;
  var mysql_cli=mysql.createConnection({
    host:'127.0.0.1',
    port:3306,
    password:'123456',
    user:'root',
    database:"vr02"
  });
  mysql_cli.connect();
  mysql_cli.query('select * from bk',function(err,data){
    //console.log(req.params.id)
    //var bk_id = data[0].id;
    //  console.log(bk_id);
      var mysql_clii = mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        password: '123456',
        user: 'root',
        database: "vr02"
      });
      mysql_clii.query("select * from bk, bk_theme where bk.id=bk_theme.bk_id", function (err, dat) {
        //console.log(dat);
        if (cookie.userInfo) {//判断是否有cookie
          console.log(cookie);
          console.log(cookie.userInfo.name);
          res.render('index', {user: cookie.userInfo.name, route: "注销", bk: data, cow: dat})
        } else {
          res.render('index', {user: "登录", route: "注册", bk: data, cow: dat})
        }
      });
    mysql_clii.end();
  });
});

//进入登录界面
router.get('/login',function(req,res,next){
  var cookie=req.cookies;
  if(cookie.userInfo) {
    //console.log(cookie);
    res.render('login', {user:cookie.name,route:"注销"})
  }else{
    res.render('login',{user:"登录",route:"注册"})
  }
});
//注册页面
router.get("/reg",function(req,res,next){
  var cookie=req.cookies;
  if(cookie.userInfo) {
    //console.log(cookie);
    res.render("register", {user:cookie.userInfo.name,route:"注销"})
  }else{
    res.render("register",{user:"登录",route:"注册"})
  }
});

//router.get("/tz",function(req,res,next){
//  var  mysql_cli = mysql.createConnection({
//    host:'127.0.0.1',
//    user:'root',
//    password:'123456',
//    port:3306,
//    database:'vr02'
//  });
//  mysql_cli.connect();
//  mysql_cli.query("select * from tiezi ",function(err,data){
//    //console.log(data);
//    res.render("aaa",{tz:data});
//  });
  //mysql_cli.end()
//});
//登录表单提交验证
router.get("/check",function(req,res,next){
  var name=req.query.username;
  var pwd=req.query.pwd;
  //console.log(name);
  var mysql_cli = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    port:3306,
    database:'vr02'
  });
  mysql_cli.connect();
  mysql_cli.query("select * from password where name=?",[name],function(err,data){
    //console.log(data);
    if(data[0].password==pwd){
      var id=data[0].id;
      res.cookie("userInfo",{"name":name,"password":pwd,"id":id},{expires:new Date(Date.now()+900000)});
      res.redirect("/")
    }
    //console.log(data)
  })
});
//router.get("/regYan",function(req,res,next){
//   var username=req.params.user;
//});

//注册上传数据
router.get("/doreg",function(req,res,next){
  var name=req.query.username;
  var pwd=req.query.pwd;
  var mysql_cli = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    port:3306,
    database:'vr02'
  });
  mysql_cli.connect();
  mysql_cli.query("select * from password where name=?",[name],function(err,data){
    //console.log(data);
    //if(err){
    //  console.log(err)
    //}else{
    //  if( data[0] && data[0].name==name){
    //  res.send("用户名已经被注册")
    //} else {
    //  mysql_cli.query("insert into password(name,password)values(?,?)",[name,pwd],function(err,data){
    //    res.redirect("/login");
    //    console.log("成功")
    //  })
    //}}
    if (err) {
      throw err;
    }
    if (data.length>0) {
      res.send('用户名已注册')
    } else {
      mysql_cli.query("insert into password(name,password)values(?,?)",[name,pwd],function(err,data){
        res.redirect("/login");
        console.log("成功")
      })
    }
   });
  });
//注册信息验证
router.get("/regtest",function(req,res,next){
  var name=req.query.kk;
  var mysql_cli=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    port:3306,
    database:'vr02'
  });
  mysql_cli.connect();
  mysql_cli.query("select * from password where name=?",[name],function(err,data){
    if(data[0]){
      res.send("1");
    }else{
      res.send('0')
    }
  })
});
router.get("/zx", function(req,res,next){
  res.clearCookie('userInfo');
  res.redirect('back');
});
router.get("/fa/:  id",function(req,res,next){
  var ztid=req.params.id;
  //console.log(ztid);
  var cookie=req.cookies;
  //console.log(cookie);
  if(cookie.userInfo){
    res.render("ue",{userid:cookie.userInfo.id,zd:ztid})
  }else {
    res.send("请您先登录")
  }

});
//接收发帖数据
router.post("/tie",function(req,res,next){
  var userid=req.body.userid;
  var ztid=req.body.ztid;
  console.log(ztid);
  var c=req.body.content;
  var date=req.body.date;
  var title=req.body.title;
  var  mysql_cli = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    port:3306,
    database:'vr02'
  });
  mysql_cli.connect();
  mysql_cli.query('insert into tiezi(content,ztid,userid,date,title)values(?,?,?,?,?)',[c,ztid,userid,date,title],function(err,data){
    if(!err){
      res.json(data)
    }
  });
  mysql_cli.end();
});

//j进入帖子堆积页面
router.get("/yan/:id",function(req,res,next){
  var id=req.params.id;
  //console.log(id);
  var cookie=req.cookies;
  var mysql_cli=mysql.createConnection({
    host:'127.0.0.1',

    user:'root',
    password:'123456',
    port:3306,
    database:'vr02'
  });
  mysql_cli.connect();
  mysql_cli.query("select * from bk_theme where id=?",[id],function(err,data){
    //console.log(data);
    var bk_id=data[0].bk_id;
    var ztid=data[0].id;
    mysql_cli.query("select * from bk where id=?",[bk_id],function(err,data1){
      mysql_cli.query("select * from tiezi where ztid=? ",[ztid],function(err,data2){
        if(data2[0]){
          var userid=data2[0].userid;
          console.log(data2);
          mysql_cli.query("select * from password left join tiezi on password.id=tiezi.userid where ztid=?",[ztid],function(err,data3){
            if(cookie.userInfo) {
              //console.log(data2);
              res.render("tiezi", {user:cookie.userInfo.name,route:"注销",bk:data1[0],bk_theme:data[0],tiezi:data2,username:data3})
            }else{
              res.render("tiezi",{user:"登录",route:"注册",bk:data1[0],bk_theme:data[0],tiezi:data2,username:data3})
            }
          })
        }else{
          if(cookie.userInfo) {
            //console.log(data2);
            res.render("tiezi", {user:cookie.userInfo.name,route:"注销",bk:data1[0],bk_theme:data[0],tiezi:data2,})
          }else{
            res.render("tiezi",{user:"登录",route:"注册",bk:data1[0],bk_theme:data[0],tiezi:data2,})
          }
        }
        mysql_cli.end();
      })
    })
  });
  //mysql_cli.end();
  });
//接收评论数据
router.post("/plun",function(req,res,next){
 // console.log(req.body);
  //console.log(req.cookies);

  var cookie=req.cookies;
  if(cookie.userInfo){
    var userid=cookie.userInfo.id;
    var tieid=req.body.tieid;
    var neirong=req.body.content;
    var pldate=req.body.plsj;
    var mysql_cli=mysql.createConnection({
      host:'127.0.0.1',
      user:'root',
      password:'123456',
      port:3306,
      database:'vr02'
    });
    mysql_cli.connect();
    mysql_cli.query("insert into pinglun (neirong,userid,tieid,date) values (?,?,?,?)",[neirong,userid,tieid,pldate],function(err,data){
      if(data.affectedRows > 0) {
        res.json({result: 1});
      } else {
        res.json({result: 0});
      }
    });
    mysql_cli.end();
  }
});
//进入单个帖子详情界面
router.get("/pl/:id",function(req,res,next){
  var cookie=req.cookies;
  var tieid=req.params.id;
  var mysql_cli=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    port:3306,
    database:'vr02'
  });
  mysql_cli.connect();
  mysql_cli.query("select * from tiezi where id=?",[tieid],function(err,data){
    //console.log(data);
    var userid=data[0].userid;
    var ztid=data[0].ztid;
    //console.log(ztid);
    //console.log("select * from bk_theme where id=" + ztid);
    mysql_cli.query("select * from bk_theme where id=?",[ztid],function(err,data1){
     // console.log(data1);
      var bk_id=data1[0].bk_id;
      mysql_cli.query("select * from bk where id=?",[bk_id],function(err,data2){
        mysql_cli.query("select * from password where id=?",[userid],function(err,data3){
          mysql_cli.query("select * from pinglun where tieid=?",[tieid],function(err,data4){
            console.log(data4);
            if(data4[0]){
              var plid=data4[0].userid;
              mysql_cli.query("select * from password left join pinglun on password.id=pinglun.userid where tieid=?",[tieid],function(err,data5){
                //console.log(data5);
                if(cookie.userInfo) {
                  res.render("pltie", {user:cookie.userInfo.name,route:"注销",tiezi:data[0],bk_theme:data1[0],bk:data2[0],username:data3[0].name,pilun:data4,plrows:data5})
                }else{
                  res.render("pltie",{user:"登录",route:"注册",tiezi:data[0],bk_theme:data1[0],bk:data2[0],username:data3[0].name,pilun:data4,plrows:data5})
                }
              })
            }else {
              if (cookie.userInfo) {
                res.render("pltie", {
                  user: cookie.userInfo.name,
                  route: "注销",
                  tiezi: data[0],
                  bk_theme: data1[0],
                  bk: data2[0],
                  username: data3[0].name,
                  pilun:data4,
                })
              } else {
                res.render("pltie", {
                  user: "登录",
                  route: "注册",
                  tiezi: data[0],
                  bk_theme: data1[0],
                  bk: data2[0],
                  username: data3[0].name,
                  pilun:data4,
                })
              }
            }
            mysql_cli.end();
          });

        })
      })
    })
  });
});
//测试新插件async
/*router.get("/test",function(req,res,next){
   var mysql_cli=mysql.createConnection({
     host:'127.0.0.1',
     user:'root',
     password:'123456',
     port:3306,
     database:'vr02'
   });
  mysql_cli.connect();
  var sql={
    table_a: "select * from bk",
    table_b: "select * from bk_theme",
    table_c: "select * from tiezi"
  };
  var counts={};
  console.log(counts);
  res.send("查询成功")
});
async.forEachOf(sql, function(value, key, callback) {
  // 遍历每条SQL并执行
  mysql_cli.query(value, function(err, results) {
    if(err) {
      callback(err);
    } else {
      counts[key] = results;
      callback();
    }
  });
}, function(err) {
  // 所有SQL执行完成后回调
  if(err) {
    console.log(err);
  } else {
    console.log(counts);
  }
});*/
/*router.get("test1",function(req,res,next){
  var mysql_cli=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    port:3306,
    database:'vr02'
  });
  var connection=mysql_cli.connect();

  var tasks = {
    table_a: function(callback) {
      connection.query('select * from bk', function(err, result) {
        callback(err, result); // 将结果传入callback
      });
    },
    table_b: function(callback) {
      connection.query('select * from bk_theme', function(err, result) {
        callback(err, result);
      });
    },
    table_c: function(callback) {
      connection.query('select * from tiezi', function (err, result) {
        callback(err, result);
      });
    }
  };

  async.series(tasks, function(err, results) {
    if(err) {
      console.log(err);
    } else {
      console.log(results);
    }
    connection.end();
  });
});*/

//可以再设置cookie让含有用户id，得到用户id再得到版块id，然后再得到主题id
//然后再去将发的帖子渲染放到页面
//router.get("");
module.exports = router;
