const Payment = require('../models/Payment');
const Policy = require('../models/Policy');
const { Op } = require('sequelize');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Policy,
          as: 'policy', // Ensure this matches the alias in the association
          attributes: ['policyNumber', 'insuredName', 'totalPremium']
        }
      ],
      order: [['paymentDate', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

// Get payments by company, policyId, or paymentType
exports.getPaymentsByFilter = async (req, res) => {
  try {
    const { company, policyId, paymentType } = req.query;
    const where = {};
    if (company) where.company = company;
    if (policyId) where.policyId = policyId;
    if (paymentType) where.paymentType = paymentType;
    const payments = await Payment.findAll({ where });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

// Get payments by policy ID
exports.getPaymentsByPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const payments = await Payment.findAll({
      where: { policyId },
      include: [{
        model: Policy,
        attributes: ['policyNumber', 'insuredName', 'totalPremium']
      }],
      order: [['paymentDate', 'DESC']]
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

// Create new payment
exports.createPayment = async (req, res) => {
  try {
    const { policyId, amount, paymentType } = req.body;

    // Get policy details
    const policy = await Policy.findByPk(policyId);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Calculate remaining amount for part payments
    let remainingAmount = null;
    if (paymentType === 'Part') {
      const existingPayments = await Payment.findAll({
        where: { policyId, status: 'Completed' }
      });
      const totalPaid = existingPayments.reduce((sum, payment) => sum + payment.amount, 0);
      remainingAmount = policy.totalPremium - (totalPaid + Number(amount));
      
      if (remainingAmount < 0) {
        return res.status(400).json({ message: 'Payment amount exceeds remaining premium' });
      }
    }

    const payment = await Payment.create({
      ...req.body,
      totalPremium: policy.totalPremium,
      remainingAmount
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // If updating amount for part payment, recalculate remaining amount
    if (payment.paymentType === 'Part' && req.body.amount) {
      const policy = await Policy.findByPk(payment.policyId);
      const existingPayments = await Payment.findAll({
        where: { 
          policyId: payment.policyId, 
          status: 'Completed',
          id: { [Op.ne]: id } // Exclude current payment
        }
      });
      const totalPaid = existingPayments.reduce((sum, payment) => sum + payment.amount, 0);
      req.body.remainingAmount = policy.totalPremium - (totalPaid + Number(req.body.amount));
      
      if (req.body.remainingAmount < 0) {
        return res.status(400).json({ message: 'Payment amount exceeds remaining premium' });
      }
    }

    await payment.update(req.body);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    await payment.destroy();
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
};

// Add part payment
