const express=require('express');
const {posturl, redirectUrl}=require('../controllers/url.controller');
const {validateCreateUrl}=require("../middlewares/validateCreateUrl")

const router=express.Router();

router.post('/',validateCreateUrl,posturl)
router.get('/:shortCode',redirectUrl);

module.exports=router;