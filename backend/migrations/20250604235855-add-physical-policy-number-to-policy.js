'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('policy', 'physical_policy_number', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Physical policy number in the format number_month_year',
    });
    await queryInterface.addIndex('policy', ['physical_policy_number']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('policy', ['physical_policy_number']);
    await queryInterface.removeColumn('policy', 'physical_policy_number');
  }
};
