const User_model = require("../model/users_model");
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const config = require("config");



module.exports = {

    get_all: async (req, res, next) => {
        User_model
            .find()
            .then(x => res.send(x))
            .catch(r => res.send(r.message))

    },

    get_one_by_id: async (req, res, next) => {
        User_model
            .findById({
                _id: req.params.id
            })
            .then(x => res.send(x))
            .catch(r => res.send(r.message))

    },

    post_one: async (req, res, next) => {
        const hashed_password = await bcrypt.hash(req.body.passWord, 10);
        new User_model({
            userName: req.body.userName,
            userMail: req.body.userMail,
            passWord: hashed_password,
            //passWord: req.body.passWord,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userPhone: req.body.userPhone,
            userPost: req.body.userPost
        })
            .save()
            .then(x => res.send(x))
            .catch(r => res.send(r.message))



    },

    log_one: async (req, res, next) => {

        let logger = await User_model.findOne({ userName: req.body.userName });
        if (!logger) return res.status(400).send("Email not found");

        const pass = await bcrypt.compare(req.body.passWord, logger.passWord);
        if (!pass) return res.status(400).send("Password did not match");

        const token = logger.token_gen()

        res.header("x-auth-token", token).send(logger)
        // res.send("logger penetrated successfully, token :", token)

    },

    put_one_by_id: async (req, res, next) => {
        User_model.update(
            {
                _id: req.params.id
            },
            {
                $set:
                {
                    userName: req.body.userName,
                    userMail: req.body.userMail,
                    passWord: req.body.passWord,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    userPhone: req.body.userPhone,
                    userPost: req.body.userPost
                }
            })
            .exec()
            .then(x => res.send(x))
            .catch(r => res.send(r.message))


    },

    delete_one_by_id: async (req, res, next) => {
        User_model.findOneAndRemove(
            {
                _id: req.params.id
            })
            .exec()
            .then(x => res.send(x))
            .catch(r => res.send(r.message))


    }
}