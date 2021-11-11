const router = require('express').Router()
const Trello = require('trello');
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");

router.get("/", function(req, res) {
    if (req.user) {
        res.sendStatus(403)
    } else {
        res.redirect(new URL(`https://${req.hostname}${(req.hostname == "localhost") ? ":4000" : ""}/main/auth/discord`))
    }
})

module.exports = router