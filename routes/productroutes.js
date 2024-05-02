const router = require('express').Router();
const { createProducts, getAllProducts, getProducById, deleteProduct } = require('../controllers/productControllers');
const { verifyRole } = require('../controllers/userControllers');
const auth = require('../middlewares/authMiddleware');

router.post('/addproducts', createProducts);
router.get('/', auth, verifyRole(['user', 'merchant', 'admin']), getAllProducts);
router.get('/:productId', getProducById);
router.delete('/:productId', deleteProduct);

module.exports = router;