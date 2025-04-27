const { register, login, getAllEmployees, resetPassword } = require('../controllers/authCont')
const router = require('express').Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getAllEmployees', getAllEmployees)
router.post('/resetPassword', resetPassword)

module.exports = router