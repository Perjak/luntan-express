/**
 * Created by 1234 on 2017/4/19.
 */
var express=require('express');
var router=express();
var mysql=require("mysql");
//进入版块管理
router.get("/",function(req,res,next){
    res.render("./admin/index")
});
//查询版块
router.get("/bklist",function(req,res,next){
    var mysql_cli=mysql.createConnection({
        host:"127.0.0.1",
        user:"root",
        port:3306,
        password:'123456',
        database:'vr02'
    });
    mysql_cli.connect();
    mysql_cli.query("select * from bk",function(err,data){
        if(err){
            console.log("出错了");
            throw err
        } else {
            res.render("./admin/bklist",{
                rows:data
            })
        }
    });
    mysql_cli.end()
});
//进入添加版块路由
router.get("/addbk",function(req,res,next){
    res.render("./admin/createbk")
});
//在数据库添加版块并跳转到查询版块页面
router.get("/doaddbk",function(req,res,next){
    var name=req.query.bkname;
    //console.log(name);
   var mysql_cli=mysql.createConnection({
       host:"127.0.0.1",
       user:"root",
       port:3306,
       password:'123456',
       database:'vr02'
   }) ;
    mysql_cli.connect();
    mysql_cli.query("insert into bk(name)value(?)",[name],function(err,data){
        if(err){
           console.log(err)
        }else{
            res.redirect("bklist")
        }
    });
    mysql_cli.end()
});
//进入修改主题页面
router.get("/edit/:id",function(req,res,next){
    var mysql_cli=mysql.createConnection({
        host:"127.0.0.1",
        user:'root',
        port:3306,
        password:'123456',
        database:'vr02'
    });
    mysql_cli.connect();
    mysql_cli.query('select * from bk where id=?',[req.params.id],function(err,data){
        if (err){
            throw err
        }else{
            console.log(data);
            res.render("./admin/updatabk",{row:data[0]})
        }
    });
    mysql_cli.end()
});
//提交修改版块主题
router.get('/doupdatabk',function(req,res,next){
    var name=req.query.bkname;
    var id=req.query.id;
    console.log(name);
    console.log(id);
   var mysql_cli=mysql.createConnection({
       host:"127.0.0.1",
       user:'root',
       port:3306,
       password:'123456',
       database:'vr02'
   });
    mysql_cli.connect();
    mysql_cli.query("update bk set name = ? where id=?",[name,id],function(err,data){
        if (err){
            throw err
        }else{
            res.redirect("bklist")
        }
    });
    mysql_cli.end();
});
//主题管理的路由
router.get("/ztlist",function (req,res,next){
    var mysql_cli=mysql.createConnection({
        host:"127.0.0.1",
        user:'root',
        port:3306,
        password:'123456',
        database:'vr02'
    });
    mysql_cli.query("select * from bk_theme ",function(err,data){
        res.render("./admin/bk_theme",{
            lt:data
        })
    })
});
//进入添加界面的路由
router.get("/addzt",function(req,res,next){
    var mysql_cli=mysql.createConnection({
        host:"127.0.0.1",
        user:'root',
        port:3306,
        password:'123456',
        database:'vr02'
    });
    mysql_cli.connect();
    mysql_cli.query("select * from bk",function(err,data){
        res.render("./admin/create_theme",{
            ck:data
        })
    })
});
//提交版块名称
router.get("/update_theme",function(req,res,next){
    var bk_id=req.query.bk_id;
    var name=req.query.themename;
    console.log(bk_id);
    console.log(name);
    var mysql_cli=mysql.createConnection({
        host:"127.0.0.1",
        user:'root',
        port:3306,
        password:'123456',
        database:'vr02'
    });
    mysql_cli.connect();
    mysql_cli.query("insert into bk_theme(bk_id,name)values(?,?)",[bk_id,name],function(err,data){
      res.redirect("ztlist")
    });
    mysql_cli.end();
});
//进入主题名字编辑
router.get('/edit_zt/:id',function(req,res,next){
    var id=req.params.id;
    console.log(id);
    var mysql_cli=mysql.createConnection({
        host:"127.0.0.1",
        user:'root',
        port:3306,
        password:'123456',
        database:'vr02'
    });
    mysql_cli.connect();
    mysql_cli.query("select * from bk_theme where id=?",[id],function(err,data){
        console.log(data);
        res.render("./admin/updatezt",{
            jk:data[0]
        })
    });
    mysql_cli.end();
});
//提交修改主题的内容
router.get("/doupdatazt",function(req,res,next){
    var id=req.query.id;
    var name=req.query.ztname;
    console.log(id);
    var mysql_cli=mysql.createConnection({
        host:"127.0.0.1",
        user:'root',
        port:3306,
        password:'123456',
        database:'vr02'
    });
    mysql_cli.connect();
    mysql_cli.query("update bk_theme set name=? where id=?",[name,id],function(err,data){
        res.redirect("ztlist")
    })

});
module.exports = router;