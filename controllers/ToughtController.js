const Tought = require('../models/Tought')//importacao de models/Tought
const User = require('../models/User')//importacao de models/User

module.exports = class ToughtController{
    static async showToughts(req,res) {
        res.render('toughts/home')
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

        res.render('toughts/dashboard', { toughts })
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

        const id = req.body.id
        const UserId = req.session.userid//pega o UserId da sessao

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
}