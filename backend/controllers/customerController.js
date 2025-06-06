const Customer = require('../models/Customer');
const Policy = require('../models/Policy');
const { Op } = require('sequelize');
const { sequelize } = require('../config/dbConn');

// Get all customers with optional filtering
exports.getAllCustomers = async (req, res) => {
  try {
    const { search, policy } = req.query;
    let where = {};

    // Filter by policy type
    if (policy && policy !== 'All') {
      where.policy = policy;
    }

    // Search functionality
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const customers = await Customer.findAll({ 
      where,
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new customer
exports.createCustomer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, phone, email, policy, conversionDate } = req.body;

    // Check if customer with same phone or email already exists
    const existingCustomer = await Customer.findOne({
      where: {
        [Op.or]: [
          { phone },
          { email: email || null }
        ]
      },
      transaction
    });

    if (existingCustomer) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Customer with this phone or email already exists' });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      policy,
      conversionDate: conversionDate || new Date(),
      status: 'Active'
    }, { transaction });

    await transaction.commit();
    res.status(201).json(customer);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log('UpdateCustomer request body:', req.body);
    const { name, phone, email, policy, status, conversionDate } = req.body;
    const customerId = req.params.id;

    // Check if customer exists
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if phone or email is being changed and if it conflicts with existing customers
    if (phone !== customer.phone || email !== customer.email) {
      const existingCustomer = await Customer.findOne({
        where: {
          [Op.and]: [
            { id: { [Op.ne]: customerId } },
            {
              [Op.or]: [
                { phone },
                { email: email || null }
              ]
            }
          ]
        },
        transaction
      });

      if (existingCustomer) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Customer with this phone or email already exists' });
      }
    }

    // Only update conversionDate if provided
    const updateFields = { name, phone, email, policy, status };
    if (conversionDate) updateFields.conversionDate = conversionDate;

    const [updatedRows] = await Customer.update(
      updateFields,
      {
        where: { id: customerId },
        transaction
      }
    );

    const updatedCustomer = await Customer.findByPk(customerId, { transaction });

    await transaction.commit();
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('UpdateCustomer error:', error);
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const customerId = req.params.id;

    // Check if customer exists
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Delete only the customer, not the associated policies
    await customer.destroy({ transaction });

    await transaction.commit();
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
}; 