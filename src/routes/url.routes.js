const express=require('express');
const {posturl}=require('../controllers/url.controller')
const router=express.Router();

router.post('/',posturl)

module.exports=router;