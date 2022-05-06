const express = require('express')
const router = express.Router()
//controller
const ToughtController = require('../controllers/ToughtController')
//import check auth middleware
const checkAuth = require('../helpers/auth').checkAuth


//rotas create toughts
router.post('/add', checkAuth, ToughtController.createToughtsSave)
router.get('/add', checkAuth, ToughtController.createToughts)
//rotas edit rota dinamica
router.get('/edit/:id', checkAuth, ToughtController.updateTought)
router.post('/edit', checkAuth, ToughtController.updateToughtSave)
//rota dashboard
router.get('/dashboard', checkAuth, ToughtController.dashboard)
//rota remove
router.post('/remove', checkAuth, ToughtController.removeTought)
//rota '/'
router.get('/', ToughtController.showToughts)

module.exports = router