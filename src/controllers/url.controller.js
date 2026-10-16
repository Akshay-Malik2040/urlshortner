const posturl=(req,res)=>{
    try{
        const org_url=req.body;
        res.status(200).json({
            original_url:org_url
        })
    }
    catch(err){
        res.status(400).json({
            message:"Some error occur"
        })
    }
}

module.exports={posturl}