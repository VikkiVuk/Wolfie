module.exports.randomLetter = async() => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    return alphabet[Math.floor(Math.random() * alphabet.length)]  
}

module.exports.randomNumber = async(min, max) => {
    const randomNum = Math.floor(Math.random() * (max - min) + min)
    return randomNum
}