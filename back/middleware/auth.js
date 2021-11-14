const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId) { // On indique si l'id est le même => false = Id non valide
            throw 'User ID non Valide'
        }
        else{
            next();
        }
    }
    catch(err) { console.log('Une erreur est servenu lors de la tentative de reconnaissance ' + err)}
}