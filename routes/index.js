const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
// const upload = multer({dest: 'images/'}) //dest : 저장 위치
const path = require('path');
const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'images/');
      },
      filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + path.extname(file.originalname));
      }
    }),
  });

router.post('/api/register', function(req, res){
    console.log('/register');
    User.findOne({ uid: req.body.uid }, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(user) return res.status(400).json({ message: 'already registered'});
        const new_user = new User(req.body);
        new_user.save();
        res.json({});
    });
});

router.post('/api/contacts/post/:uid', function(req, res){
    console.log('/contacts/post');
    User.findOne({ uid: req.params.uid}, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        user.contacts.push(req.body);
        user.save();
        res.json(req.body);
        console.log('post contact done');
    });
});

router.post('/api/images/post/:uid', upload.single('img'),(req,res)=>{
    console.log('post image');
    var image = req.file;
    console.log(req.file);
    console.log(req.body);

});

router.get('/api/login/:uid', function(req, res){
    console.log('/login');
    User.findOne({uid: req.params.uid}, function(err, user){
        console.log(req.params.uid);
        if(err) return res.status(500).json({error: err}); 
        if(!user) {
            console.log("no user data");
            return res.status(400).json({message: 'not registered yet'})}
        res.json("login success");
        console.log('login success');
    });
});

router.get('/api/contacts/:uid', function(req, res){
    console.log('/contacts');
    User.findOne({ uid: req.params.uid }, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        res.json(user.contacts);
    });
});

router.get('/api/images/:uid', function(req, res){
    console.log('/images');
    User.findOne({ uid: req.params.uid }, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        res.json(user.images);
        console.log('imagessssssss');
    });
})

router.get('/api/users', function(req, res){
    console.log('/users');
    User.find(function(err, users){
        if(err) return res.status(500).json({error: err});
        res.json(users);
        console.log("users:"+json(users));
    })
});

router.get('/api/images/get/:img', function(req, res){
    console.log('image load');
    var img =  req.params.img;
    res.sendFile(path.join(__dirname, '..', 'images', img));
    console.log('image send');
});

module.exports = router;