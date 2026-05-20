const { getUser } = require("../Service/auth");


function checkforAuthentication(req,res,next){
    const tokenCookie=req.cookies.token;
    const authHeader = req.headers['authorization'];
    let token = null;
    if (tokenCookie) {
        token = tokenCookie;
    } else if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split("Bearer ")[1];
    }
    if (token) {
        const user = getUser(token);
        if(!user) return res.status(401).json({error: "Unauthorized"});
        req.user = user;
        next();
    } else {
        req.user = null;
        return res.status(401).json({error: "Unauthorized"});
    }
}

module.exports=checkforAuthentication