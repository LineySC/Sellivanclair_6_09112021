const express = require('express');
const router = express.Router();
const saucesControllers = require('../controllers/sauces');

//Importation des middleWare
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

//Routes des sauces 

router.post('/', auth, multer, saucesControllers.createSauces);
router.get('/', auth, saucesControllers.getAllSauces);
router.get('/:id', auth, saucesControllers.getOneSauce);
router.put('/:id', auth, saucesControllers.modifySauces);
router.delete('/:id', auth, saucesControllers.deleteSauces);
router.post('/:id/like', auth, saucesControllers.likes);

module.exports = router;