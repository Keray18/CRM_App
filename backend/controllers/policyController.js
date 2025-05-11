const Policy = require('../models/Policy');
const Leads = require('../models/LeadsModel');
const { Op } = require('sequelize');
const { sendEmail } = require('../utils/emailService');

// Get all policies with optional filtering
exports.getAllPolicies = async (req, res) => {
  try {
    const { status, type, search, month } = req.query;
    let where = {};

    // Filter by status
    if (status && status !== 'all') {
      where.status = status;
    }

    // Filter by type
    if (type) {
      where.type = type;
    }

    // Search functionality
    if (search) {
      where[Op.or] = [
        { policyNumber: { [Op.like]: `%${search}%` } },
        { insuredName: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by month (assume month is a string like 'March')
    if (month && month !== 'All') {
      const monthIndex = new Date(`${month} 1, 2024`).getMonth();
      const year = new Date().getFullYear();
      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 0);
      where.startDate = { [Op.between]: [startDate, endDate] };
    }

    const policies = await Policy.findAll({ where, order: [['createdAt', 'DESC']] });
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single policy by ID
exports.getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findByPk(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new policy
exports.createPolicy = async (req, res) => {
  try {
    const policyData = req.body;
    console.log(policyData);

    // Check if policy number already exists
    const existingPolicy = await Policy.findOne({ where: { policyNumber: policyData.policyNumber } });
    if (existingPolicy) {
      return res.status(400).json({ message: 'Policy number already exists' });
    }

    // If leadId is provided, you can update the lead's status here if you have a Lead model in SQL
    // (Not implemented here)

    const policy = await Policy.create(policyData);

    // Send email notification
    try {
      await sendEmail(policy.email, 'policyCreated', policy);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(policy);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update a policy
exports.updatePolicy = async (req, res) => {
  try {
    const [updatedRows, [updatedPolicy]] = await Policy.update(
      { ...req.body },
      {
        where: { id: req.params.id },
        returning: true,
        individualHooks: true
      }
    );
    if (!updatedRows) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.status(200).json(updatedPolicy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a policy
exports.deletePolicy = async (req, res) => {
  try {
    const deletedRows = await Policy.destroy({ where: { id: req.params.id } });
    if (!deletedRows) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.status(200).json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update policy status
exports.updatePolicyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [updatedRows, [updatedPolicy]] = await Policy.update(
      { status },
      {
        where: { id: req.params.id },
        returning: true,
        individualHooks: true
      }
    );
    if (!updatedRows) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.status(200).json(updatedPolicy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get policy statistics
exports.getPolicyStats = async (req, res) => {
  try {
    const totalPolicies = await Policy.count();
    const activePolicies = await Policy.count({ where: { status: 'Live Policy' } });
    const lapsedPolicies = await Policy.count({ where: { status: 'Lapsed' } });
    const pendingPolicies = await Policy.count({ where: { status: 'Pending' } });

    // Get policies by type
    const vehiclePolicies = await Policy.count({ where: { type: 'vehicle' } });
    const healthPolicies = await Policy.count({ where: { type: 'health' } });
    const travelPolicies = await Policy.count({ where: { type: 'travel' } });

    // Get monthly statistics
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyPolicies = await Policy.count({
      where: {
        startDate: {
          [Op.between]: [
            new Date(currentYear, currentMonth, 1),
            new Date(currentYear, currentMonth + 1, 0)
          ]
        }
      }
    });

    res.status(200).json({
      totalPolicies,
      activePolicies,
      lapsedPolicies,
      pendingPolicies,
      byType: {
        vehicle: vehiclePolicies,
        health: healthPolicies,
        travel: travelPolicies
      },
      monthlyPolicies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leads for policy conversion using the Leads model
exports.getLeadsForPolicy = async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};

    // Search functionality
    if (search) {
      where[Op.or] = [
        { leadName: { [Op.like]: `%${search}%` } },
        { leadPhone: { [Op.like]: `%${search}%` } },
        { leadEmail: { [Op.like]: `%${search}%` } }
      ];
    }

    // You can add more filters here if you want to exclude converted/deleted leads
    // For now, fetch all matching leads
    const leads = await Leads.findAll({
      where,
      attributes: ['id', 'leadName', 'leadPhone', 'leadEmail', 'leadPolicyType', 'remarks', 'leadCreateDate'],
      order: [['leadCreateDate', 'DESC']]
    });

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 