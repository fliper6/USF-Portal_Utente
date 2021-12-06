const sgMail = require('@sendgrid/mail')

const API_KEY = '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'

sgMail.setApiKey(API_KEY)

module.exports.send = (email, codigo) => {
    let msg = {
        to: email,
        from: {
            name: "USF - Portal do Utente",
            email: 'usfmanuelrochapeixoto@gmail.com'
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
