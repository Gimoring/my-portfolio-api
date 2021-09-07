const mongoose = require('mongoose');
const Portfolio = require('../db/models/portfolio');

// read ALL portfolio
exports.getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({});
    return res.json(portfolios);
  } catch (err) {
    return res.json('cannot find data');
  }
}

// read one portfolio by ID
exports.getPortfoliosById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    return res.json(portfolio);
  } catch (err) {
    return res.status(422).json(err.message); //invalid req status
  }
} 

// create one portfolio 

exports.createPortfolio = async (req, res) => {
  const portfolioData = req.body;
  const userId = req.user.sub;
  const portfolio = new Portfolio(portfolioData); // 내부적으로 인스턴스 생성. not connected to Mongo
  portfolio.userId = userId;
  // console.log(portfolio);
  try {
    const newPortfolio = await portfolio.save();
    return res.json(newPortfolio);
  } catch (err) {
    return res.status(422).json(err.message);
  }

}

// update portfolio

exports.updatePortfolio = async (req, res) => {
  const {body, params: { id }} = req;
  try {
    // validator 정의한 모델의 스키마에 따라서 검증해준다. 
    const updatedPortfolio = await Portfolio.findOneAndUpdate({_id: id}, body, {new: true, runValidators: true});
    return res.json(updatedPortfolio);
  } catch (err) {
    return res.status(422).json(err.message);
  }
}


// delete portfolio

exports.deletePortfolio = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const portfolio = await Portfolio.findOneAndDelete({_id: id});
    return res.json({_id: portfolio.id})
  } catch (err) {
    console.log(err);
    return res.status(422).json(err.message);
  }
}