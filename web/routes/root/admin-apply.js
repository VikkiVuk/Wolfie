const router = require('express').Router()
const Trello = require('trello');
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");

router.get("/", function(req, res) {
    if (req.user) {
        res.send(`
        <html>
        <head>
            <title>Admin Apply</title>
            <meta content="Prijavi se za admina!" property="og:title" />
            <meta content="Ovde mozes da se prijavis za admina u discord server VikkiVuk Community. Ukoliko zelis da nesto preporucis idi na /suggest a ne /admin-apply.." property="og:description" />
            <meta content="https://discord-wolfie.herokuapp.com/main/admin-apply" property="og:url" />
            <meta content="" property="og:image" />
            <meta content="#ED262D" data-react-helmet="true" name="theme-color" />
        </head>
        <body style="background-color: #3c3c3c;">
            <center>
                <br> <h1 style="font-family: Arial, Helvetica, sans-serif;color: white;font-size: 50px;">Prijavi se za admina!</h1>
                <form method="post" action="/main/admin-apply/send">
                    <label for="email" style="color:white;font-family: Arial, Helvetica, sans-serif;">Email:</label>
                    <input type="email" id="email" name="email" placeholder="johndoe@mydomain.com"><br><br>
                    <label for="fname" style="color:white;font-family: Arial, Helvetica, sans-serif;">Kako se zoves:</label>
                    <input type="text"  id="fname" name="fname" placeholder="ex. John Doe"><br><br>
                    <label for="age" style="color:white;font-family: Arial, Helvetica, sans-serif;">Koliko godina imas:</label>
                    <input type="text"  id="age" name="age" placeholder="ex. 14"><br><br>
                    <label for="adminreason" style="color:white;font-family: Arial, Helvetica, sans-serif;">Zasto zelis da budes admin:</label>
                    <input type="text"  id="adminreason" name="adminreason" placeholder="ex. Jer _____, i _____...">
                    <h1 style="font-family: Arial, Helvetica, sans-serif;color: white;font-size: 50px;">Sta bi uradio!</h1>
                    <label for="advertisement-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">Sta bi uradio ako se neko reklamira:</label><br>
                    <select name="advertisement-situation" id="advertisement-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Upozori</option>
                    </select><Br><br>
                    <label for="insult-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">Sta bi uradio ako bi neko vredjao nekog drugog:</label><br>
                    <select name="insult-situation" id="insult-situation" multiple>
                        <option value="mute">Mute sve</option>
                        <option value="kick">Kick sve</option>
                        <option value="ban">Ban sve</option>
                        <option value="warn">Upozori sve</option>
                    </select><Br><br>
                    <label for="arguing-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">Sta bi uradio ako bi video da se 2 ili vise coveka svadjaju:,</label><br>
                    <select name="arguing-situation" id="arguing-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Upozori</option>
                    </select><Br><br>
                    <label for="generalcommands-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">Sta bi uradio ako bi video da ljudi koriste bot komande u caskanje:</label><br>
                    <select name="generalcommands-situation" id="generalcommands-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Upozori</option>
                    </select><Br><br>
                    <label for="dm-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">Sta bi uradio ako bi te neko iz servera dm-ovao:</label><br>
                    <select name="dm-situation" id="dm-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Upozori</option>
                    </select><Br><br>
                    <label for="spamping-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">Sta bi uradio ako bi neko spam pingovao:</label><br>
                    <select name="spamping-situation" id="spamping-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Upozori</option>
                    </select><Br><br>
                    <label for="filterbypass-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">Sta bi uradio ako bi neko bypassovao filter na botu:</label><br>
                    <select name="filterbypass-situation" id="filterbypass-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Upozori</option>
                    </select><Br><br>
                    <label for="link-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">Sta bi uradio ako bi neko poslao link negde:</label><br>
                    <select name="link-situation" id="link-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Upozori</option>
                    </select><Br><br>
                    <input type="checkbox" id="change_agree" name="change_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="change_agree"> Da li razumes da moras da pitas @VikkiVuk (@NotVikki/@sukablyat) pre nego sto nesto promenis na serveru.</label><br><br>
                    <input type="checkbox" id="rulebreak_agree" name="rulebreak_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="rulebreak_agree"> Da li razumes da ako prekrsis neko pravilo bices demotovan.</label><br><br>
                    <input type="checkbox" id="readrules_agree" name="readrules_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="readrules_agree"> Da li si procitao sva pravila</label><br><br>
                    <input type="checkbox" id="answeredhonestly_agree" name="answeredhonestly_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="answeredhonestly_agree"> Da li si na sve odgovorio iskreno.</label><br><br>
                    <input type="checkbox" id="tos_agree" name="tos_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="tos_agree"> Prihvatam uslove deljenja moje informacije i da cu biti informisan ako moja prijava bude prihvacena.</label><br><br>
    
                    <input type="submit" value="Posalji!" style="border: white; height: 70px; width: 500px; font-family: Arial, Helvetica, sans-serif; font-size: 50px; cursor:pointer;">
                </form>
            </center>
        </body>
    </html>
        `)
    } else {
        res.redirect(new URL(`http://${req.hostname}:${(process.env.PORT == undefined) ? 4000 : process.env.PORT}/main/auth/discord`))
    }
})

router.post("/send", (req, res) => {
    const { readrules_agree, answeredhonestly_agree, change_agree, tos_agree, rulebreak_agree } = req.body
	if (readrules_agree && answeredhonestly_agree && change_agree && tos_agree && rulebreak_agree) {
		const answers = JSON.parse(JSON.stringify(req.body));

        let ntext = ""
		let htmltext = ""

		for (const question in answers) {
            ntext += `${question}: ${(answers[question] == "") ? "Nije dodat odgovor" : answers[question]} \n`
            htmltext += `${question}: ${(answers[question] == "") ? "Nije dodat odgovor" : answers[question]}<br>`
		}

        trello.addCard("Admin apply od " + req.user.discordTag + ". Vise informacija u deskripciji", ntext, '6113905b2a1f784cd57db3a7', function(error, card) {
            if (error) {
                res.send("Doslo je do greske i tvoja prijava nije poslata.")
            } else {
                res.send(`Hvala sto si se prijavio za admina! Neko iz naseg apply tima ce uskoro da ti pregleda prijavu. Dole imas detalje sta je poslato nasem osoblju. <br> <br> ${htmltext}`)
            }
        })
	} else {
		res.send("Molim te prihvati sve ili neces moci da se prijavis.")
	}
})

module.exports = router