const sgMail = require('@sendgrid/mail')

const API_KEY = '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'

sgMail.setApiKey(API_KEY)

module.exports.send = (email, codigo) => {
    let msg = {
        to: email,
        from: {
            name: "USF - Portal do Utente",
            email: 'ramos.trabalhador99@gmail.com'
        }, 
        subject: 'Código de verificação',
        text: 'Importante!',
        html: `<html>
              <h3> USF-Portal do Utente </h3>
              Boa tarde,</br>
                  Este é o código de acesso à aplicação USF-Portal do Utente:</br> 
                  <strong>${codigo}</strong>
              </html>`
      }
    return sgMail.send(msg)
}
