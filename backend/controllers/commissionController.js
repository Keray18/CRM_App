const Commission = require('../models/Commission');
const Policy = require('../models/Policy');

// Get all commissions
exports.getAllCommissions = async (req, res) => {
  try {
    const commissions = await Commission.findAll({ order: [['company', 'ASC'], ['policyType', 'ASC']] });
    res.json(commissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commissions', error: error.message });
  }
};

// Get commissions by company and/or policyType
exports.getCommissionsByFilter = async (req, res) => {
  try {
    const { company, policyType } = req.query;
    const where = {};
    if (company) where.company = company;
    if (policyType) where.policyType = policyType;
    const commissions = await Commission.findAll({ where });
    res.json(commissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commissions', error: error.message });
  }
};

// Create new commission
exports.createCommission = async (req, res) => {
  try {
    const commission = await Commission.create(req.body);
    res.status(201).json(commission);
  } catch (error) {
    res.status(500).json({ message: 'Error creating commission', error: error.message });
  }
};

// Update commission
exports.updateCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const commission = await Commission.findByPk(id);
    if (!commission) return res.status(404).json({ message: 'Commission not found' });
    await commission.update(req.body);
    res.json(commission);
  } catch (error) {
    res.status(500).json({ message: 'Error updating commission', error: error.message });
  }
};

// Delete commission
exports.deleteCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const commission = await Commission.findByPk(id);
    if (!commission) return res.status(404).json({ message: 'Commission not found' });
    await commission.destroy();
    res.json({ message: 'Commission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting commission', error: error.message });
  }
};

// Get commission breakdown for a company (all policies and their commissions)
exports.getCompanyCommissionBreakdown = async (req, res) => {
  try {
    const { company } = req.params;
    // Get all policies for this company
    const policies = await Policy.findAll({ where: { company }, order: [['createdAt', 'DESC']] });
    // Get commission agreement for this company
    const commissions = await Commission.findAll({ where: { company } });
    // Map each policy to its commission agreement
    const breakdown = policies.map(policy => {
      const commission = commissions.find(c => c.policyType === policy.type);
      return {
        policyId: policy.id,
        policyNumber: policy.policyNumber,
        policyType: policy.type,
        effectiveCommission: commission ? commission.effectiveCommission : null,
        tpCommission: commission ? commission.tpCommission : null,
        odCommission: commission ? commission.odCommission : null,
        addonCommission: commission ? commission.addonCommission : null,
        policyPremium: policy.premium,
        policyStartDate: policy.startDate,
        policyEndDate: policy.endDate,
        customer: policy.insuredName,
      };
    });
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commission breakdown', error: error.message });
  }
}; 