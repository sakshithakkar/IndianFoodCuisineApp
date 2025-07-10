const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');
const auth = require('../middlewares/authMiddleware');


router.get('/dishes', dishController.getAllDishes);
router.get('/dishes/:id', dishController.getDishById);
router.post('/suggest', dishController.suggestDishes);
router.get('/ingredients', dishController.getAllIngredients);
router.get('/search', dishController.searchDishes);
router.post('/addDish', auth, dishController.addDish);
router.get('/my-dishes', auth, dishController.getDishesByUserId);

module.exports = router;
