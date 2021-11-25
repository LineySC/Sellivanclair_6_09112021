const Sauce = require('../models/Sauce');
const mongoose = require('mongoose');
const fs = require('fs');


//CREATE => POST => Création

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce ({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'La sauces à été crée'}))
        .catch(err => res.status(400).json(err));
};

//GetOne => Récupération d'une sauces
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(err => res.status(400).json(err));
};

//GetAll => Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(err => res.status(400).json(err))
}

//UpdateOne => PUT => Modification
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }   : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id:req.params.id})
        .then(() => res.status(200).json({message: "La sauce à bien été modifiée !"}))
        .catch(err => res.status(400).json(err))
}

//DELETE => Supprimer 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauces => {
        const filename = sauces.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: "La sauce à bien été suprimé"} + console.warn('Sauce supprimer')))
            .catch(err => res.status(400).json(err))
        })
    })
}

//Like/Dislike +-1

exports.likes = (req, res, next) => {
    const reqLike = req.body.like;
    const reqUserId = req.body.userId;

    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {

        if(reqLike === 1 && !sauce.usersLiked.includes(reqUserId)){
            Sauce.updateOne({ $inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id })
                .then(() => res.status(204).json({ message: 'Le like à été enregistré !' }))
                .catch(err => res.status(400).json(console.log(err)))
        }

        else if(reqLike === -1 && !sauce.usersLiked.includes(reqUserId)){
            sauce.updateOne({ $inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id })
                .then(() => res.status(204).json({ message : 'Le diskile a été pris en compte' }))
                .catch(err => res.status(400).json(console.log(err)))
        }

        else if(reqLike === 0 && sauce.usersLiked.includes(reqUserId)){
            Sauce.updateOne({ $inc: {likes: -1 }, $pull: {usersLiked: req.body.userId}, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Le like a été retiré !' }))
                .catch(err => res.status(400).json(console.log(err)))
        }

        else if(reqLike === 0 && sauce.usersDisliked.includes(reqUserId)){
            Sauce.updateOne({ $inc: {dislikes: -1 }, $pull: {usersDisliked: req.body.userId}, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Le dislike a été retiré !' }))
                .catch(err => res.status(400).json(console.log(err)))
        }
        else{
            res.status(400)
        }
    })
    .catch(err => res.status(400).json(err))
};
