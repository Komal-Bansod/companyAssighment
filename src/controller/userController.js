const userModel = require('../model/userModel.js')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true

}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


const createUserData = async function (req, res) {
    try {
        let data = req.body
    const { title, fullName,email, password} = data

        if (!isValidRequestBody(data))
            return res.status(400).send({ status: false, msg: "Please Enter some data" })
        
            if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Title is Required" })
        }
       
       const titleEnum = function (title){
           return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
       }

       if(!titleEnum(title)){
           return res.status(400).send({status:false, msg:"Is not valid title provide Mr, Mrs, Miss "})
       }
       

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, msg: "Name is Required" })
        }
        
        if (isValid(email))
            if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)))
                return res.status(400).send({ status: false, msg: "is not a valid email" })
        if (!isValid(email))
            return res.status(400).send({ status: false, msg: "email is required" })

        
        let alreadyExistEmail = await userModel.findOne({ email: email })
        if (alreadyExistEmail) {
            return res.status(400).send({ status: false, msg: "email already exit" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "Password is Required" })
        }
        // if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(data.password))) {
        //     return res.status(400).send({ status: false, msg: "please provide valid password with one uppercase letter ,one lowercase, one character and one number " })
        // }
        let hash = await bcrypt.hash(password, 10)

        const finalData = {title:title, fullName:fullName, email:email,password: hash }
        

        // if (isValid(data.address.pincode))

        //     if (!(/^([+]\d{2})?\d{6}$/.test(data.address.pincode)))
        //         return res.status(400).send({ status: false, msg: "Please Enter  a Valid pincode Number" })


        let savedData = await userModel.create(finalData )
        res.status(201).send({status :true, msg:"succesfully run", data: savedData })

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
const loginUser = async function(req, res){
    try{
        let data = req.body
        if(!data){
            return res
            .status(400)
            .send({status:false, msg:"data required for login"})
        }
        let email = req.body.email
        let password = req.body.password
    
        if(!isValid(email)){
            return res
            .status(400)
            .send({status:false, msg:"email is requires"})
        }
    
        let Email = email
                let validateEmail = function (Email) {
                    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email);
                }
                if (!validateEmail(Email)) {
                    return res.status(400).send({ status: false, message: "Please enter a valid email" })
                }
    
        let isUserExist = await userModel.findOne({email})
    
        if(!isUserExist){
            return res
            .status(404)
            .send({status:false, msg:" User Not Found Please Check Email"})
        }
    
        if(!isValid(password)){
            return res
            .status(400)
            .send({status:false, msg:"password is required"})
        }
    
        // if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(data.password))) {
        //     return res.status(400).send({ status: false, msg: "please provide valid password" })
        // }
    
        let pass = isUserExist.password

        let check = await bcrypt.compare(password,pass)
        
        if(!check){return res.status(400).send({status:false, msg: "password is incorrect"})}
    
        let token = jwt.sign(
            {
                userId:isUserExist._id.toString(),
                iat: Math.floor(Date.now() / 1000),
               exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60
            },
            "projectfiveshoppingkart",
            
        );
        res.cookie("authorization", token)
        res
        .status(200)
        .send({status:true, message: 'user Login SuccessFull', data:{ userId:isUserExist._id, token }})
    
    }catch(err){
        res.status(500).send({ status: false, message: err.message })
    }
    }

// const loginUser = async function (req, res) {

//     try {

//         let body = req.body

//         if (Object.keys(body) != 0) {
//             let userName = req.body.email;
//             let passwords = req.body.password;
//             if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(userName)))
//              { return res.status(400).send({ status: false, msg: "Please provide a valid email" }) }
//             // if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(passwords))) {
//             //     return res.status(400).send({ status: false, msg: "please provide valid password with one uppercase letter ,one lowercase, one character and one number " })
//             // }



//             let user = await userModel.findOne({ email: userName, password: passwords });

//             if (!user) {

//                 return res.status(400).send({
//                     status: false,
//                     ERROR: "username or the password is not corerct",
//                 });
//             }
//             let check = await bcrypt.compare(passwords)

//             if(!check){return res.status(400).send({status:false, msg: "password is incorrect"})}
            
//             let token = jwt.sign(
//                 {
//                     userId: user._id,
//                     email: user._email

//                 }, "outshade"

//             );
            
//             res.status(200).cookie("x-auth-token", token);
//             return res.status(201).send({ status: "LoggedIn", TOKEN: token });
//         }

//         else { return res.status(400).send({ ERROR: "Bad Request" }) }

//     }
//     catch (err) {

//         return res.status(500).send({ ERROR: err.message })
//     }

// };


module.exports.createUserData = createUserData;
module.exports.loginUser = loginUser;

