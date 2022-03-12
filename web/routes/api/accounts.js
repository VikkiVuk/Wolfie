const router = require('express').Router()
const backend = require('../../../bot/utility/backend')
const passport = require("passport")
const got = require('got')
let api = "https://accounts.vikkivuk.xyz/user/"

router.get("/link/redirect", passport.authenticate('discord'), (req, res, next) => {
    res.redirect("https://accounts.vikkivuk.xyz/authorize?callback=https://wolfie.pro/api/accounts/link")
})
router.get("/link", async(req,res, next) => {
    let user = await req.user
    if (user) {
        let params = await req.query
        if (params.uuid) {
            got.post(api + "get/" + params.uuid).then(async (response) => {
                if (response.body) {
                    console.log(response.body)
                }
            })
        } else {
            res.redirect("https://accounts.vikkivuk.xyz/authorize?callback=https://wolfie.pro/api/accounts/link")
        }
    } else {
        passport.authenticate('discord')(req, res, next)
    }
})

module.exports = router