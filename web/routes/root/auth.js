const router = require('express').Router()
const passport = require('passport')

router.get("/discord", passport.authenticate('discord'))
router.get("/discord/redirect", passport.authenticate('discord'), (req, res) => {
    res.redirect(new URL(`http://${req.hostname}:${(process.env.PORT == undefined) ? 4000 : process.env.PORT}/main`))
})

router.get("/", (req, res) => {
    res.send(JSON.parse(JSON.stringify(req.user)))
})
module.exports = router