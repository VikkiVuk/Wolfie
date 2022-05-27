const router = require('express').Router()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let api = "https://accounts.vikkivuk.xyz/user/"
let schema = require("../../../bot/utility/schemas/user-schema")

router.get("/link", async(req,res, next) => {
    let params = await req.query

    if (params.discord_id) {
        if (params.code) {
           try {
               let exchangedResponse = await fetch(`https://accounts.vikkivuk.xyz/api/exchange_token`, {method:'POST',redirect:'follow',headers:{"content-type": "application/json"},body:`{"client_id": "431d40b5-4ed6-48cf-b134-975aeef1e678","secret":"c4ac806a-7a81-480b-ae4e-5fbaf701aa17","token":"${params.code}"}`})
               let exchangedJson = await exchangedResponse.json()
               let uuid = exchangedJson.uuid

               let response = await fetch("https://accounts.vikkivuk.xyz/api/getUser/" + uuid, {method: "GET",redirect:"follow"})
               let vikkiuser = await response.json()
               if (vikkiuser) {
                   await schema.findOneAndUpdate({userid: user.discordId}, {accountId:params.uuid})
                   res.send("Your account has been linked! You can now safely return back to discord, and continue migrating your account.")
               }
           } catch(e) {
               console.error(e)
               res.send("An error has occured")
           }
        } else {
            res.redirect("https://accounts.vikkivuk.xyz/authorize.html?client_id=431d40b5-4ed6-48cf-b134-975aeef1e678&redirect_uri=https://wolfie.pro/api/accounts/link&scopes=profile+email&response_type=code&state=" + params.discord_id)
        }
    } else {
        res.send("Missing Discord ID.")
    }
})

module.exports = router