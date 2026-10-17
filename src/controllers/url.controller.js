const { createShortUrl, getUrlByShortCode } = require("../services/url.service");

const posturl = async (req, res) => {
    try {
        const {original_url} = req.body;
        if (!original_url) {
            return res.status(400).json({
                message: "original_url is required",
            });
        }

        const data = await createShortUrl(original_url);
        res.status(201).json(data)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to create short URL",
        })
    }
}

const redirectUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url=await getUrlByShortCode(shortCode);
        console.log("url is :",url);
        if(!url){
            return res.status(404).json({
                message: "Short URL not found",
            })
        }

        const redirectTo = /^[a-z][a-z\d+.-]*:/i.test(url.original_url)
            ? url.original_url
            : `https://${url.original_url}`;

        return res.redirect(302, redirectTo)
    } catch (err) {
        console.error("Error redirecting URL:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

const urlDetails= async(req,res)=>{
    try{
        const {shortCode}= req.params;
        const url=await getUrlByShortCode(shortCode);

        if(!url){
            return res.status(404).json({
                message: "Short URL not found",
            })
        }
        res.status(500).json(url);

    } catch(err){
        res.status(404).json({
            message:"ShortCode not found"
        })
    }
}
module.exports = { posturl,redirectUrl, urlDetails }