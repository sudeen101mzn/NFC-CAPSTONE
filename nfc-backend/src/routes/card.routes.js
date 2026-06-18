const express = require('express');
const cardController = require('../controllers/card.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', cardController.getUserCards);
router.post('/', cardController.addCard);
router.get('/:cardId', cardController.getCardById);
router.patch('/:cardId', cardController.updateCard);
router.patch('/:cardId/block', cardController.blockCard);
router.patch('/:cardId/unblock', cardController.unblockCard);
router.patch('/:cardId/default', cardController.setDefaultCard);
router.delete('/:cardId', cardController.deleteCard);

module.exports = router;
