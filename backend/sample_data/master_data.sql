-- Policy Types
INSERT INTO masterdata (type, name, description, is_active, created_at, updated_at) VALUES
('Policy Type', 'Motor Insurance', 'Coverage for vehicles including cars, bikes, and commercial vehicles', true, NOW(), NOW()),
('Policy Type', 'Health Insurance', 'Medical coverage for individuals and families', true, NOW(), NOW()),
('Policy Type', 'Life Insurance', 'Financial protection for beneficiaries in case of death', true, NOW(), NOW()),
('Policy Type', 'Travel Insurance', 'Coverage for travel-related risks and emergencies', true, NOW(), NOW()),
('Policy Type', 'Property Insurance', 'Protection for residential and commercial properties', true, NOW(), NOW());

-- Departments
INSERT INTO masterdata (type, name, description, is_active, created_at, updated_at) VALUES
('Department', 'Sales', 'Handles policy sales and client acquisition', true, NOW(), NOW()),
('Department', 'Underwriting', 'Risk assessment and policy approval', true, NOW(), NOW()),
('Department', 'Claims', 'Processes and manages insurance claims', true, NOW(), NOW()),
('Department', 'Customer Service', 'Handles customer inquiries and support', true, NOW(), NOW()),
('Department', 'Finance', 'Manages financial operations and accounting', true, NOW(), NOW()),
('Department', 'IT', 'Manages technology infrastructure and systems', true, NOW(), NOW());

-- Positions
INSERT INTO masterdata (type, name, description, is_active, created_at, updated_at) VALUES
('Position', 'Sales Executive', 'Responsible for selling insurance policies', true, NOW(), NOW()),
('Position', 'Sales Manager', 'Manages sales team and targets', true, NOW(), NOW()),
('Position', 'Underwriter', 'Assesses risks and approves policies', true, NOW(), NOW()),
('Position', 'Claims Adjuster', 'Evaluates and processes insurance claims', true, NOW(), NOW()),
('Position', 'Customer Service Representative', 'Handles customer inquiries and support', true, NOW(), NOW()),
('Position', 'Finance Manager', 'Oversees financial operations', true, NOW(), NOW()),
('Position', 'IT Manager', 'Manages IT infrastructure and systems', true, NOW(), NOW());

-- Status
INSERT INTO masterdata (type, name, description, is_active, created_at, updated_at) VALUES
('Status', 'Active', 'Policy is currently active and in force', true, NOW(), NOW()),
('Status', 'Pending', 'Policy is under review or processing', true, NOW(), NOW()),
('Status', 'Expired', 'Policy has reached its end date', true, NOW(), NOW()),
('Status', 'Cancelled', 'Policy has been terminated', true, NOW(), NOW()),
('Status', 'Lapsed', 'Policy has expired due to non-payment', true, NOW(), NOW()),
('Status', 'Renewed', 'Policy has been renewed for another term', true, NOW(), NOW());

-- Document Types
INSERT INTO masterdata (type, name, description, is_active, created_at, updated_at) VALUES
('Document Type', 'Policy Document', 'Official insurance policy document', true, NOW(), NOW()),
('Document Type', 'Claim Form', 'Document for filing insurance claims', true, NOW(), NOW()),
('Document Type', 'ID Proof', 'Government issued identification document', true, NOW(), NOW()),
('Document Type', 'Address Proof', 'Document verifying residential address', true, NOW(), NOW()),
('Document Type', 'Income Proof', 'Document showing income details', true, NOW(), NOW()),
('Document Type', 'Medical Report', 'Health assessment document', true, NOW(), NOW()),
('Document Type', 'Vehicle Registration', 'Vehicle registration document', true, NOW(), NOW());

-- Commission Types
INSERT INTO masterdata (type, name, description, is_active, created_at, updated_at) VALUES
('Commission Type', 'First Year Commission', 'Commission for first year of policy', true, NOW(), NOW()),
('Commission Type', 'Renewal Commission', 'Commission for policy renewals', true, NOW(), NOW()),
('Commission Type', 'Referral Commission', 'Commission for successful referrals', true, NOW(), NOW()),
('Commission Type', 'Performance Bonus', 'Additional commission for meeting targets', true, NOW(), NOW());

-- Insurance Companies
INSERT INTO masterdata (type, name, description, is_active, created_at, updated_at) VALUES
('Insurance Company', 'LIC', 'Life Insurance Corporation of India', true, NOW(), NOW()),
('Insurance Company', 'HDFC Ergo', 'HDFC Ergo General Insurance Company', true, NOW(), NOW()),
('Insurance Company', 'ICICI Lombard', 'ICICI Lombard General Insurance', true, NOW(), NOW()),
('Insurance Company', 'Bajaj Allianz', 'Bajaj Allianz General Insurance', true, NOW(), NOW()),
('Insurance Company', 'Tata AIA', 'Tata AIA Life Insurance', true, NOW(), NOW()),
('Insurance Company', 'Max Life', 'Max Life Insurance Company', true, NOW(), NOW()),
('Insurance Company', 'SBI Life', 'SBI Life Insurance Company', true, NOW(), NOW()); 