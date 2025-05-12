const { register, login, getAllEmployees, resetPassword, deleteEmployee } = require('../controllers/authCont')
const router = require('express').Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getAllEmployees', getAllEmployees)
router.post('/resetPassword', resetPassword)
router.delete('/:id', deleteEmployee)

module.exports = router