const { getCart, createCart, deleteProduct } = require('../controllers/cartController');
const auth = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.get('/getcart', auth, getCart);
router.post('/createcart', auth, createCart);
router.delete('/deleteproduct', auth, deleteProduct);

module.exports = router;