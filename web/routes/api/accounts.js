const router = require('express').Router()
const backend = require('../../../bot/utility/backend')
const passport = require("passport")
router.get("/link/redirect", passport.authenticate('discord'), (req, res) => {
    res.redirect("https://accounts.vikkivuk.xyz/authorize?callback=https://wolfie.pro/api/accounts/link")
})
router.get("/link", async(req,res) => {
    let user = await req.user
    if (user) {
        res.send("wait")
    } else {
        let url = "https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https://wolfie.pro/api/accounts/link/redirect&scope=identify%20guilds&client_id=880049472246284328"
        res.redirect(url)
    }
})

module.exports = router