const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');

router.post('/login', function(req, res){
    console.log('/login');
    User.findOne({uid: req.body.uid}, function(err, user){
        console.log(user);
        if(err) return res.status(500).json({error: err}); 
        if(!user) return res.status(400).json({ message: 'uid not found'});
        res.json({user});
    });
});

router.post('/register', function(req, res){
    console.log('/register');
    User.findOne({ uid: req.body.uid }, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(user) return res.status(400).json({ message: 'already registered'});
        const new_user = new User(req.body);
        new_user.save();
        res.json({});
    });
});

router.get('/contacts/:uid', function(req, res){
    console.log('/contacts');
    User.findOne({ uid: req.params.uid }, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        res.json(user.contacts);
    });
});

router.get('/images/:uid', function(req, res){
    console.log('/images');
    User.findOne({ uid: req.params.uid }, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({ error: 'user not found' });
        res.json(user.images);
    });
})

router.get('/users', function(req, res){
    console.log('/users');
    User.find(function(err, users){
        if(err) return res.status(500).json({error: err});
        res.json(users);
    })
});


module.exports = router;