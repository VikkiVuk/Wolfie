const router = require('express').Router()
const backend = require('../../../bot/utility/backend')

router.post("/", (req, res) => {
    try {
		if (req.body.apikey == "vikkivuk-wolfie"){
			if (req.body.fnc == "roblox-verif") {
				if (req.body.args) {
					let client = backend.getClient()

                    const {discorduser, robloxuser, status} = req.body.args
                    if (status == "completed") {
                        const user = client.guilds.cache.get("878606227045756948").members.cache.find(m => m.id == discorduser)
                        user.send("You have successfully linked your discord account: **" + user.user.tag + "** with your roblox account: https://www.roblox.com/users/" + robloxuser + "/profile")
                        user.roles.add('895753436941942795')
                        res.status(200).send("The user has been notified.")
                    }
				} else {
					res.status(400).send("No args")
				}
			} else {
				res.status(400).send("Invalid Function")
			}
		} else {
			res.status(403).send("Invalid Apikey")
		}
	} catch(e) {
		console.error(e)
		res.status(400).send({
			"message": "An error has occured",
			"error": e
		})
	}
})

module.exports = router