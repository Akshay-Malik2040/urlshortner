const {createShortUrl}=require("../services/url.service");

const posturl=async(req,res)=>{
    try{
        const org_url=req.body;
        console.log(org_url);
        const data=await createShortUrl(org_url);
        console.log(data);
        res.status(201).json(data)
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Some error occur",
        })
    }
}

module.exports={posturl}