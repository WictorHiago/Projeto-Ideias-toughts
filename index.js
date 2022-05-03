//importando pacotes
const express = require('express')
const exphbs = require("express-handlebars");
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express();

const conn = require('./db/conn')//importaçao do banco de dados

//Models
const Tought = require('./models/Tought')
const User = require('./models/User')

//Import Routes
const toughtsRoutes = require('./routes/toughtsRoutes')
//Import authRoutes
const authRoutes = require('./routes/authRoutes')

//Import Controllers
const ToughtController = require('./controllers/ToughtController')

//template engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//receber resposta do body
app.use(
    express.urlencoded({
        entended: true
    })
)

app.use(express.json())

//session meddleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: 'false',
        saveUninitialized: 'false',
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(),'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    })
)

//flash messages
app.use(flash())

//public path
app.use(express.static('public'))

//set session to res
app.use((req, res, next) => {

    if(req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

//Routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.use('/', ToughtController.showToughts)

//conn//ligação com banco de dados
  //  .sync({force: true})//força criar coluna UserId
    //.sync()
 //   .then(()=> {
        app.listen(3030)// PORT
   // })
    //.catch((err)=> console.log(err))
        