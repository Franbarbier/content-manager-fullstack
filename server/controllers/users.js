import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) =>{
    const user = req.body
    console.log(user)
    try{
        var userLogin = await User.find({
                                        mail: user.username,
                                        password: user.password,
                                    }).exec()
        if(userLogin.length>0){
            const token = jwt.sign({user: userLogin}, 'secretkey')
            res.status(200).json({error:0, token, user:userLogin[0]})
        }else{
            res.json({error: 1, message: "User not found."})
        }
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

