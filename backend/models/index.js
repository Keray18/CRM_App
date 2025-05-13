const Policy = require('./Policy');
const Payment = require('./Payment');

Policy.hasMany(Payment, { foreignKey: 'policyId' });
Payment.belongsTo(Policy, { foreignKey: 'policyId' });

module.exports = {
  Policy,
  Payment,
  // ...add other models here as needed
}; 