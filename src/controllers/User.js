const randStr = require('randomstring');
const { saveUser, updateUser, getUsers, deleteUser, findOne, modify } = require("../services/User");
const { passwordToHash, generateAccesToken, generateRefreshToken } = require("../utils/helper");
const eventEmitter = require("../scripts/events/eventsEmitter");
const User = require("../services/User");
const userService = new User();
const index = (req, res) => {
    userService.get(req.params?.id).then(respose => {
        res.status(200).send(respose);
    }).catch(err => {
        res.status(500).send(err);
    })
}

const create = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    userService.save(req.body).then(respose => {
        res.status(200).send(respose);
    }).catch(err => {
        res.status(500).send(err);
    })
}

const update = (req, res) => {
    var id = req.params?.id;
    if (req.body?.password) {
        req.body.password = passwordToHash(req.body.password);
    }
    userService.updateWithID(id, req.body).then(response => res.status(200).send(response))
        .catch(err => res.status(500).send(err));
}


const remove = (req, res) => {
    var id = req.params?.id;
    userService.delete(id).then(respose => {
        res.status(200).send(respose);
    }).catch(err => {
        res.status(500).send(err);
    })
}

const login = (req, res) => {
    req.body.password = passwordToHash(req.body.password);
    userService.findOne(req.body).then(user => {
        if (user) {
            user = {
                ...user.toObject(),
                tokens: {
                    accessToken: generateAccesToken({
                        name: user.username,
                        ...user
                    }),
                    refreshToken: generateRefreshToken({
                        name: user.username,
                        ...user
                    })
                }
            }
            delete user.password;
            res.status(200).send(user);
            return;
        }
        return res.status(401).send({
            error: "Kullanıc adı veya şifre hatalı."
        });
    }).catch(err => {
        res.status(500).send(err);
    })
}


const resetPassword = (req, res) => {
    var password = randStr.generate(20);
    userService.updateWithWhere({ email: req.body?.email }, { password: passwordToHash(password) }).then(updatedUser => {
        if (!updatedUser) return res.status(404).send({ error: "User not found" });
        eventEmitter.emit("send_email", {
            to: updatedUser.email,
            subject: "Reset Password",
            html: `Şifre sıfırlama işlememiz gerçekleşmiştir<br/> Yeni Şifreniz: <b>${password}</b>`
        });
        res.status(200).send({
            message: "Yeni şifreniz e-mail adresine gönderildi"
        });
    }).catch(err => res.status(500).send(err));
}

module.exports = {
    index,
    create,
    update,
    remove,
    login,
    resetPassword
}
