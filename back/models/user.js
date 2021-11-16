//Importation des modules
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Création du Schéma
const userSchema = mongoose.Schema ({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//Vérification de l'unicité
userSchema.plugin(uniqueValidator);

//Exportation du modules
module.exports = mongoose.model('User', userSchema);