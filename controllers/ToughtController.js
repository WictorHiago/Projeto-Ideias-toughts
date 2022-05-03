const { raw } = require('express')
const Tought = require('../models/Tought')//importacao de models/Tought
const User = require('../models/User')//importacao de models/User

module.exports = class ToughtController{

    static async showToughts(req,res) {
        //busca todos os pensamentos
        const toughtData = await Tought.findAll({
            include: User,
        })

        const toughts = toughtData.map((result) => result.get({ plain: true}))

        res.render('toughts/home',{toughts})
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
        //check if user exists
        if(!user) {
            res.redirect('/login')
        }
        //tras a tabela de tarefas criadas
        const toughts = user.Toughts.map((result) => result.dataValues)
        //se a lista de tarefas estiver vazia entao ela é false
        let emptyToughts =false// é LET para poder alterar seu valor

        if(toughts.length === 0){
            emptyToughts = true
        }

        res.render('toughts/dashboard', { toughts, emptyToughts })
    }

    static createToughts(req, res) {
        res.render('toughts/create')
    }
    //async para esperar a resposta do Banco
    static async createToughtsSave(req, res) {

        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try{
            //await espera o Banco criar
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

        const id = req.body.id//pegamos o id que está no body
        const UserId = req.session.userid//pegamos o UserId da sessao

        try{

            await Tought.destroy({where: {id: id, UserId: UserId}})//filtra pelo id do Banco e pelo UserId da sessao

            req.flash('message', 'Pensamento removido com sucesso!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })

        } catch (error) {
            console.log('Aconteceu um ' + error)
        }

    }

    static async updateTought(req, res) {
        const id = req.params.id //para pegar o id
        //tem que se await pois tem que esperar essa requisição
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