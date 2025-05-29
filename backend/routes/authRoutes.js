const { register, login, getAllEmployees, resetPassword, deleteEmployee, updateEmployee } = require('../controllers/authCont')
const router = require('express').Router()
const authenticate = require('../middleware/auth')
const { requirePrivilegedEmployee, requireStandardEmployee } = require('../middleware/rbac')

router.post('/register', register)
router.post('/login', login)
router.get('/getAllEmployees', authenticate, requirePrivilegedEmployee, getAllEmployees)
router.post('/resetPassword', authenticate, resetPassword)
router.delete('/:id', authenticate, requirePrivilegedEmployee, deleteEmployee)
router.put('/:id', authenticate, requirePrivilegedEmployee, updateEmployee)
// Example: Only standard employees can access their profile
router.get('/myProfile', authenticate, requireStandardEmployee, (req, res) => {
  res.json({ profile: req.user })
})

module.exports = router