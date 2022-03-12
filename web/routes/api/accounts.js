const router = require('express').Router()
const backend = require('../../../bot/utility/backend')
const passport = require("passport")
router.get("/link/redirect", passport.authenticate('discord'), (req, res, next) => {
    res.redirect("https://accounts.vikkivuk.xyz/authorize?callback=https://wolfie.pro/api/accounts/link")
})
router.get("/link", async(req,res) => {
    let user = await req.user
    console.log(user)
    if (user) {
        res.send("wait")
    } else {
        passport.authenticate('discord')(req, res, next)
    }
})

module.exports = router