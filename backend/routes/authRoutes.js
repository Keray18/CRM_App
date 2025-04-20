const { register, login, getAllEmployees } = require('../controllers/authCont')
const router = require('express').Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getAllEmployees', getAllEmployees)

module.exports = router