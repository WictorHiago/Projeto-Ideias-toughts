const express = require('express')
const router = express.Router()
//controller
const ToughtController = require('../controllers/ToughtController')
//helpers
const checkAuth = require('../helpers/auth').checkAuth


//rotas create toughts
router.post('/add', checkAuth, ToughtController.createToughtsSave)
router.get('/add', checkAuth, ToughtController.createToughts)

//rota dashboard
router.get('/dashboard', checkAuth, ToughtController.dashboard)
//rota remove
router.post('/remove', checkAuth, ToughtController.removeTought)

//rota '/'
router.get('/', ToughtController.showToughts)

module.exports = router