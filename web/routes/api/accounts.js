const router = require('express').Router()
const passport = require("passport")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let api = "https://accounts.vikkivuk.xyz/user/"
let schema = require("../../../bot/utility/schemas/user-schema")

router.get("/link/redirect", passport.authenticate('discord'), (req, res, next) => {
    res.redirect("https://accounts.vikkivuk.xyz/authorize?callback=https://wolfie.pro/api/accounts/link")
})
router.get("/link", async(req,res, next) => {
    let user = await req.user
    console.log(user)
    if (user) {
        let params = await req.query
        if (params.uuid) {
           try {
               let response = await fetch("https://accounts.vikkivuk.xyz/getuser/" + params.uuid, {method: "GET",redirect:"follow"})
               let user = await response.json()
               if (user) {
                   schema.findOneAndUpdate({userid: user.userid}, {VikkiVukAccountID:params.uuid})
                   res.send("Your account has been linked! You can now safely return back to discord, and continue migrating your account.")
               }
           } catch(e) {
               console.error(e)
               res.send("An error has occured")
           }
        } else {
            res.redirect("https://accounts.vikkivuk.xyz/authorize?callback=https://wolfie.pro/api/accounts/link")
        }
    } else {
        passport.authenticate('discord')(req, res, next)
    }
})

module.exports = router