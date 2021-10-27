const router = require('express').Router()

router.use("/auth", require('./auth') )
router.use("/discord", require('./discord') )
router.use("/suggest", require('./suggest'))
router.use("/admin-apply", require('./admin-apply'))

router.use("/", function(req, res) {
    res.send(`
        <head>
            <title> Dashboard </title>
            <meta content="Wolfie Dashboard" property="og:title" />
            <meta content="Zdravo! Ovde imate sve sta mozete da radite na wolfie sajtu, dokumentaciju isto imate." property="og:description" />
            <meta content="https://discord-wolfie.herokuapp.com/main" property="og:url" />
            <meta content="" property="og:image" />
            <meta content="#087CF0" data-react-helmet="true" name="theme-color" />
        </head>
        <body style="background-color:#3c3c3c;">
        <center>
            <h1 style="color:white;font-family: Arial, Helvetica, sans-serif;"> ${(req.user == undefined) ? "Dobrodosao!" : `Dobrodosao ${req.user.discordTag}`} </h1>
            
            ${(req.user == undefined) ? `
                <a style="color:white;font-family: Arial, Helvetica, sans-serif;" href="/main/auth/discord">Nisi ulogovan, uloguj se!</a>
            ` : `
                <h2 style="color:white;font-family: Arial, Helvetica, sans-serif;"> Dashboard </h2>
                <p style="color:white;font-family: Arial, Helvetica, sans-serif;"> Uskoro </p>

                <br>

                <h2 style="color:white;font-family: Arial, Helvetica, sans-serif;"> Ostalo </h2>
                <a style="color:white;font-family: Arial, Helvetica, sans-serif;" href="/main/admin-apply"> Admin apply. </a> <br>
                <a style="color:white;font-family: Arial, Helvetica, sans-serif;" href="/main/suggest"> Preporuci nesto. </a> 
            `}
        </center>
        </body>
    `)
})

module.exports = router