const inquirer = require('inquirer')
const colors = require('colors') // eslint-disable-line no-unused-vars
const fetchSecretKey = require('./lib/fetchSecretKey')
const fetchChallenges = require('./lib/fetchChallenges')
const options = require('./lib/options')

const generateCTFExport = require('./lib/generators/')

const juiceShopCtfCli = async () => {
  const questions = [
    {
      type: 'list',
      name: 'ctfFramework',
      message: 'CTF Framework the generated files should be for?',
      choices: [options.ctfdFramework, options.fbctfFramework],
      default: 0
    },
    {
      type: 'input',
      name: 'juiceShopUrl',
      message: 'Juice Shop URL to retrieve challenges?',
      default: 'https://juice-shop.herokuapp.com'
    },
    {
      type: 'input',
      name: 'ctfKey',
      message: 'Secret key <or> URL to ctf.key file?',
      default: 'https://raw.githubusercontent.com/bkimminich/juice-shop/master/ctf.key'
    },
    {
      type: 'list',
      name: 'insertHints',
      message: 'Insert a text hint along with each CTFd Challenge?',
      choices: [options.noTextHints, options.freeTextHints, options.paidTextHints],
      default: 0
    },
    {
      type: 'list',
      name: 'insertHintUrls',
      message: 'Insert a hint URL along with each CTFd Challenge?',
      choices: [options.noHintUrls, options.freeHintUrls, options.paidHintUrls],
      default: 0
    }
  ]

  console.log()
  console.log('Generate Game Export  with all the juicy OWASP Juice Shop Challenges!')
  console.log()

  try {
    const { ctfFramework, ctfKey, juiceShopUrl, insertHints, insertHintUrls } = await inquirer.prompt(questions)
    const [secretKey, challenges] = await Promise.all([
      fetchSecretKey(ctfKey),
      fetchChallenges(juiceShopUrl)
    ])

    await generateCTFExport(ctfFramework, challenges, {
      insertHints,
      insertHintUrls,
      ctfKey: secretKey
    })
  } catch (error) {
    console.log(error.message.red)
  }
}

module.exports = juiceShopCtfCli
