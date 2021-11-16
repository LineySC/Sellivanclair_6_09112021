const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');

//Fonction d'inscription 
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 15)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur crée !'}))
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => res.status(400).json);
};


exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(User => {
        if(!User){
            return res.status(400).json({message: "Aucun utilisateur n'a été trouvé."});
        }
        bcrypt.compare(req.body.password, User.password)
        .then(valid => {
            if(!valid) {
                return res.status(400).json({message: "Le mot de passe ne correspond pas avec l'identifiant"});
            }
            res.status(200).json({
                userId: User._id,
                token: jwt.sign(
                    {userId: User._id},
                    process.env.SECRET_TOKEN,
                    {expiresIn: '24h'}
                )
            })
        })
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => res.status(400).json(err));
}