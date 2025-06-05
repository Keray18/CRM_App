const Policy = require('../models/Policy');
const Leads = require('../models/LeadsModel');
const { Op } = require('sequelize');
const { sendEmail } = require('../utils/emailService');
const Commission = require('../models/Commission');
const { sequelize } = require('../config/dbConn'); // <-- Import sequelize for transaction

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
  const t = await sequelize.transaction();
  try {
    const policyData = req.body;
    console.log(policyData);

    // Check if policy number already exists
    const existingPolicy = await Policy.findOne({ where: { policyNumber: policyData.policyNumber }, transaction: t });
    if (existingPolicy) {
      await t.rollback();
      return res.status(400).json({ message: 'Policy number already exists' });
    }

    // --- PHYSICAL POLICY NUMBER LOGIC ---
    // Use startDate for month/year, fallback to today if not provided
    const startDate = policyData.startDate ? new Date(policyData.startDate) : new Date();
    const month = startDate.getMonth() + 1; // JS months are 0-based
    const year = startDate.getFullYear(); // full year for clarity
    const yearStr = year.toString();
    const monthStr = month.toString();

    // Find all policies for this month/year
    const firstOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const lastOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    const policiesThisMonth = await Policy.findAll({
      where: {
        startDate: { [Op.between]: [firstOfMonth, lastOfMonth] },
        physical_policy_number: { [Op.ne]: null },
      },
      attributes: ['physical_policy_number'],
      order: [['createdAt', 'ASC']],
      transaction: t,
    });
    let maxNumber = 0;
    for (const p of policiesThisMonth) {
      if (p.physical_policy_number) {
        const match = p.physical_policy_number.match(/^(\d+)_\d+_\d+$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNumber) maxNumber = num;
        }
      }
    }
    const nextNumber = maxNumber + 1;
    const physicalPolicyNumber = `${nextNumber}_${monthStr}_${yearStr}`;
    policyData.physical_policy_number = physicalPolicyNumber;
    // --- END PHYSICAL POLICY NUMBER LOGIC ---

    // If leadId is provided, you can update the lead's status here if you have a Lead model in SQL
    // (Not implemented here)

    const policy = await Policy.create(policyData, { transaction: t });

    // Upsert commission for this company and policy type
    if (policy.company && policy.type && policy.effectiveCommissionPercentage) {
      const [commission, created] = await Commission.findOrCreate({
        where: { company: policy.company, policyType: policy.type },
        defaults: { effectiveCommission: policy.effectiveCommissionPercentage },
        transaction: t,
      });
      if (!created) {
        await commission.update({ effectiveCommission: policy.effectiveCommissionPercentage }, { transaction: t });
      }
    }

    await t.commit();

    // Send email notification
    try {
      console.log(policy.email);
      await sendEmail(policy.email, 'policyCreated', policy);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(policy);
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update a policy
exports.updatePolicy = async (req, res) => {
  try {
    const [updatedRows] = await Policy.update(
      { ...req.body },
      {
        where: { id: req.params.id },
        individualHooks: true
      }
    );
    if (!updatedRows) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    const updatedPolicy = await Policy.findByPk(req.params.id);
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
    const [updatedRows] = await Policy.update(
      { status },
      {
        where: { id: req.params.id },
        individualHooks: true
      }
    );
    if (!updatedRows) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    const updatedPolicy = await Policy.findByPk(req.params.id);
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

// Add new endpoint for sending renewal reminder
exports.sendRenewalReminder = async (req, res) => {
  try {
    console.log('Received reminder request with params:', req.params);
    const { id } = req.params;
    
    if (!id) {
      console.error('No policy ID provided');
      return res.status(400).json({ message: 'Policy ID is required' });
    }

    console.log('Looking for policy with ID:', id);
    // Find the policy
    const policy = await Policy.findByPk(id);
    
    if (!policy) {
      console.error('Policy not found with ID:', id);
      return res.status(404).json({ message: 'Policy not found' });
    }

    console.log('Found policy:', {
      id: policy.id,
      policyNumber: policy.policyNumber,
      email: policy.email
    });

    if (!policy.email) {
      console.error('Policy has no email address');
      return res.status(400).json({ message: 'Policy has no email address' });
    }

    // Send renewal reminder email
    console.log('Attempting to send email to:', policy.email);
    const emailSent = await sendEmail(policy.email, 'renewalReminder', policy);
    
    if (emailSent) {
      console.log('Email sent successfully');
      res.status(200).json({ message: 'Renewal reminder sent successfully' });
    } else {
      console.error('Failed to send email');
      res.status(500).json({ message: 'Failed to send renewal reminder' });
    }
  } catch (error) {
    console.error('Error in sendRenewalReminder:', {
      error: error.message,
      stack: error.stack,
      params: req.params
    });
    res.status(500).json({ message: error.message });
  }
}; 