const router = require('express').Router()
const passport = require('passport')

router.get("/discord", passport.authenticate('discord'))
router.get("/discord/redirect", passport.authenticate('discord'), (req, res) => {
    res.redirect(new URL(`https://${req.hostname}${(req.hostname == "localhost") ? ":4000" : ""}/main`))
})

router.get("/", (req, res) => {
    res.send(JSON.parse(JSON.stringify(req.user)))
})
module.exports = router