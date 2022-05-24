import jwt from 'jsonwebtoken';


// Authorization: Bearer <token>
export const verifyToken = (req, res, next) =>{

    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1]
        req.token = bearerToken
        jwt.verify(req.token, 'secretkey', (error, authData)=>{

            if(error){
                
                res.json({error: "auth failed"})
                res.end();
                  
                }else{

                    req.operador = authData.user[0]._id
                    next()
                    
                }
            })
            
            
        }else{
           
          res.json({error: "auth failed"})
          res.end();
        
    }

}

export const getUserFromToken = (req, res) =>{

    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1]
        req.token = bearerToken
        jwt.verify(req.token, 'secretkey', (error, authData)=>{
            if(error){
                
                res.json({error: "auth failed"})
                res.end();
                
            }else{
                res.json(authData.user[0])
            }
        })  
    }else{
        res.json({error: "auth failed"})
        res.end();
    }

}
