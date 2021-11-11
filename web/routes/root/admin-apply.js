const router = require('express').Router()
const Trello = require('trello');
var trello = new Trello("03a9e1dbf3c557e05b45fecc95f68913", "1e5e621c8093255ae0752a7e67defc8384729a4fbc480fd7b01ec5923372b970");
const axios = require("axios")

router.get("/", function(req, res) {
    if (req.user) {
        res.send(`
        <html>
        <head>
            <title>Staff Apply</title>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4231389926874940" crossorigin="anonymous"></script>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta content="Apply for Staff" property="og:title" />
            <meta content="Apply for staff in our official discord server." property="og:description" />
            <meta content="https://wolfie.vikkivuk.xyz/main/admin-apply" property="og:url" />
            <meta content="" property="og:image" />
            <meta content="#ED262D" data-react-helmet="true" name="theme-color" />
            <script src="https://www.google.com/recaptcha/api.js" async defer></script>
        </head>
        <body style="background-color: #3c3c3c;">
            <center>
                <br> <h1 style="font-family: Arial, Helvetica, sans-serif;color: white;font-size: 50px;">Staff Apply</h1>
                <form method="post" action="/main/admin-apply/send">
                    <label for="email" style="color:white;font-family: Arial, Helvetica, sans-serif;">Email:</label>
                    <input type="email" id="email" name="email" placeholder="johndoe@mydomain.com"><br><br>
                    <label for="fname" style="color:white;font-family: Arial, Helvetica, sans-serif;">Full Name:</label>
                    <input type="text"  id="fname" name="fname" placeholder="ex. John Doe"><br><br>
                    <label for="age" style="color:white;font-family: Arial, Helvetica, sans-serif;">Age:</label>
                    <input type="text"  id="age" name="age" placeholder="ex. 14"><br><br>
                    <label for="adminreason" style="color:white;font-family: Arial, Helvetica, sans-serif;">Why do you want to be an admin:</label>
                    <input type="text"  id="adminreason" name="adminreason" placeholder="ex. Because _____, and _____...">
                    <h1 style="font-family: Arial, Helvetica, sans-serif;color: white;font-size: 50px;">What would you do?</h1>
                    <label for="advertisement-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">What would you do if someone advertised:</label><br>
                    <select name="advertisement-situation" id="advertisement-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Warn</option>
                    </select><Br><br>
                    <label for="insult-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">What would you do if someone insulted someone else:</label><br>
                    <select name="insult-situation" id="insult-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Warn</option>
                    </select><Br><br>
                    <label for="arguing-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">What would you do if 2 or more people were arguing:</label><br>
                    <select name="arguing-situation" id="arguing-situation" multiple>
                        <option value="mute">Mute all</option>
                        <option value="kick">Kick all</option>
                        <option value="ban">Ban all</option>
                        <option value="warn">Warn</option>
                    </select><Br><br>
                    <label for="generalcommands-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">What would you do if people used bot commands outside the intended channels:</label><br>
                    <select name="generalcommands-situation" id="generalcommands-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Warn</option>
                    </select><Br><br>
                    <label for="spamping-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">What would you do if someone started spam pinging:</label><br>
                    <select name="spamping-situation" id="spamping-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Warn</option>
                    </select><Br><br>
                    <label for="filterbypass-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">What would you do if someone bypassed the filter on the bot:</label><br>
                    <select name="filterbypass-situation" id="filterbypass-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Warn</option>
                    </select><Br><br>
                    <label for="link-situation" style="padding-top: 1%;color:white;font-family: Arial, Helvetica, sans-serif;">What would you do if someone sent a suspicious link:</label><br>
                    <select name="link-situation" id="link-situation" multiple>
                        <option value="mute">Mute</option>
                        <option value="kick">Kick</option>
                        <option value="ban">Ban</option>
                        <option value="warn">Warn</option>
                    </select><Br><br>
                    <input type="checkbox" id="change_agree" name="change_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="change_agree"> Do you understand that you have to ask the owner before making any changes?</label><br><br>
                    <input type="checkbox" id="rulebreak_agree" name="rulebreak_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="rulebreak_agree"> Do you understand that if you break the rules you will be demoted?</label><br><br>
                    <input type="checkbox" id="readrules_agree" name="readrules_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="readrules_agree"> Did you read the rules?</label><br><br>
                    <input type="checkbox" id="answeredhonestly_agree" name="answeredhonestly_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="answeredhonestly_agree"> Did you answer honestly?</label><br><br>
                    <input type="checkbox" id="tos_agree" name="tos_agree" value="true">
                    <label style="color:white;font-family: Arial, Helvetica, sans-serif;" for="tos_agree"> I consent to my information being shared to our application team.</label><br><br>
                    <div class="g-recaptcha" data-sitekey="6LezLgMdAAAAAPAJ7Nxcy4LrAxf7K43W8WfjKqKe"></div><br><br>

                    <input type="submit" value="Submit" style="border: white; height: 70px; width: 500px; font-family: Arial, Helvetica, sans-serif; font-size: 50px; cursor:pointer;">
                </form>
                <br> <br>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4231389926874940" crossorigin="anonymous"></script>
                <!-- idk -->
                <ins class="adsbygoogle"
                    style="display:block"
                    data-ad-client="ca-pub-4231389926874940"
                    data-ad-slot="9465836681"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </center>
        </body>
    </html>
        `)
    } else {
        res.redirect(new URL(`http://${req.hostname}${(req.hostname == "localhost") ? ":4000" : ""}/main/auth/discord`))
    }
})

router.post("/send", (req, res) => {
    const {"g-recaptcha-response": recaptcha} = req.body

    if (recaptcha !== '') {        
        axios.post("https://www.google.com/recaptcha/api/siteverify?secret=6LezLgMdAAAAABBzx0bsdYm_2kCq6NHDT4RArtEi&response=" + recaptcha, {}).then(response => {
            if (response.data.success == true) {
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
            } else {
                res.send("Captcha nije tacna.")
            }
        })
    } else {
        res.send("Molim te odradi captchu.")
    }
})

module.exports = router