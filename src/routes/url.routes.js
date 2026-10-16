const express=require('express');
const {posturl, redirectUrl}=require('../controllers/url.controller')
const router=express.Router();

router.post('/',posturl)
router.get('/:shortCode',redirectUrl);

module.exports=router;