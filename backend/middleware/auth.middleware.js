import jwt from "jsonwebtoken";

const authMiddleWare=(req,res,next)=>{
    const authHeader=req.headers.authorization
       if(!authHeader||!authHeader.startsWith("Bearer"))
    {
    return  res.status(401).json({
            message: "Auth token is required"
        })

    }
     const token=authHeader.split(" ")[1]
      try {

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
         req.user = decoded;
         next();
     } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }  
}

 // step 2: the token is valid, but is this person an admin?
export const is_admin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "admin access required"
        })
    }

    next()
}   


export default authMiddleWare;