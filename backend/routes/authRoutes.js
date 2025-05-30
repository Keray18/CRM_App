const { register, login, getAllEmployees, resetPassword, deleteEmployee, updateEmployee } = require('../controllers/authCont')
const checkRole = require('../middleware/checkRole')
const authenticate = require('../middleware/authenticate')
const router = require('express').Router()

router.post('/register', authenticate, checkRole(['admin']), register)
router.post('/login', login)
router.get('/getAllEmployees', authenticate, checkRole(['admin']), getAllEmployees)
router.post('/resetPassword', authenticate, checkRole(['admin']), resetPassword)
router.delete('/:id', authenticate, checkRole(['admin']), deleteEmployee)
router.put('/:id', authenticate, checkRole(['admin']), updateEmployee)

module.exports = router