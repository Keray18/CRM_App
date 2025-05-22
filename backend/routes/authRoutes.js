const { register, login, getAllEmployees, resetPassword, deleteEmployee, updateEmployee } = require('../controllers/authCont')
const router = require('express').Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getAllEmployees', getAllEmployees)
router.post('/resetPassword', resetPassword)
router.delete('/:id', deleteEmployee)
router.put('/:id', updateEmployee)

module.exports = router