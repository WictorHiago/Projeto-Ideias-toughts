const Tought = require('../models/Tought')
const User = require('../models/User')
const { Op } = require('sequelize')

module.exports = class ToughtController{

    static async showToughts(req,res) {

        let search = ''

        if(req.query.search) {
            search = req.query.search
        }

        let order = 'DESC' //descendente

        if(req.query.order === 'old') {
            order = 'ASC' //ascendente
        }

        //busca todos os pensamentos
        const toughtsData = await Tought.findAll({
            include: User,
            //tras as buscas
            where: {
                title: {[Op.like]: `%${search}%`},
            },

            order:[['createdAt', order]]

        })

        //traz a quantidade de itens encontrados na busca
        const toughts = toughtsData.map((result) => result.get({ plain: true}))
        let toughtsQty = toughts.length
        if(toughtsQty === 0) {
            toughtsQty = false
        }
        toughtsQty
        res.render('toughts/home',{toughts , search , toughtsQty})
    }

    static async dashboard(req,res) {
        const userId = req.session.userid

        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Tought,
            plain: true,
        })
        
        // if(!user) {
        //     res.redirect('/login')
        // }
        //tras a tabela de tarefas criadas
        const toughts = user.Toughts.map((result) => result.dataValues)
        
        let emptyToughts = true

        if(toughts.length > 0){
            emptyToughts = false
        }

        res.render('toughts/dashboard', { toughts, emptyToughts })
    }

    static createToughts(req, res) {
        res.render('toughts/create')
    }
    
    static async createToughtsSave(req, res) {

        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try{
            
            await Tought.create(tought)
    
            req.flash('message', 'Pensamento criado com Sucesso!')
    
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log('Aconteceu um ' + error)
        }

    }

    static async removeTought(req, res ) {

        const id = req.body.id
        const UserId = req.session.userid

        try{

            await Tought.destroy({where: {id: id, UserId: UserId}})

            req.flash('message', 'Pensamento removido com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })

        } catch (error) {
            console.log('Aconteceu um ' + error)
        }

    }

    static async updateTought(req, res) {
        const id = req.params.id
        
        const tought = await Tought.findOne( { where: {id: id}, raw: true} )

        res.render('toughts/edit', { tought })
    }

    static async updateToughtSave(req, res) {
        const id = req.body.id
        const tought = {
            title: req.body.title
        }
        try{
            await Tought.update(tought, { where: { id: id}})

        req.flash('message', 'Pensamento atualizado com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        }catch (error) {
            console.log('Aconteceu um erro: ' + error)
        }
    }
}