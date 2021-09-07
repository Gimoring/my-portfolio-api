const express = require('express');
const router = express.Router();
const { getPortfolios, getPortfoliosById, createPortfolio, updatePortfolio, deletePortfolio } = require('../controllers/portfolios');
const { checkJwt, checkRole} = require('../controllers/auth');


router.get('/portfolios',  getPortfolios);

router.get('/portfolios/:id', getPortfoliosById);

router.post('/portfolios', checkJwt, checkRole('admin'), createPortfolio);

router.patch('/portfolios/:id', checkJwt, checkRole('admin'), updatePortfolio );

router.delete('/portfolios/:id', checkJwt, checkRole('admin'), deletePortfolio);
module.exports = router;