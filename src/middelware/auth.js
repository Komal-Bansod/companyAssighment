const jwt = require('jsonwebtoken')
const userModel = require("../model/userModel")
const authentication = async (req, res, next) => {
    try {
        const token = req.header('x-auth-key')
        if (!token) {
            res.status(403).send({ status: false, message: `Missing authentication token in request` })
            return;
        }

        const decoded = await jwt.verify(token, 'outshade')

        if (!decoded) {
            res.status(403).send({ status: false, message: `Invalid authentication token in request` })
            return;
        }

        req.UserId = decoded.UserId;
        console.log(req.UserId)

        next()
     } catch (error) {
        
        res.status(500).send({ status: false, message: error.message })
    }
}


const authorisation = async (req, res, next) => {
    try {
        let token = req.cookies['x-auth-key'];
        let validToken = jwt.verify(token, 'outshade')
        if (!validToken) return res.status(401).send({ error: "You are not authenticated user" })

        let userId = req.params.userId

        //if( !bookId )   bookId = req.query.bookId

        if (!userId) {
            return res.status(400).send({ error: " Please , enter userId " })
        }
        const data = await userModel.find({ _id: userId})
        if (!data) {
            return res.status(400).send({ error: "Invalid userId" })
        }


        let Id = await userModel.findById(userId).select({ userId: 1 })
        console.log(Id)

        let eventtobemodified = Id.userId
        console.log(eventtobemodified)

        let userloggedin = validToken.UserId
        console.log(userloggedin)
        
        if (eventtobemodified != userloggedin) {
            return res.status(403).send({ msg: "Authorisation failed" })
        }



        next();
    } catch (err) {
        res.status(500).send({ error: err.message })
    }


}



module.exports.authentication = authentication
module.exports.authorisation = authorisation