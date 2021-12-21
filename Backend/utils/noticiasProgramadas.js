var moment = require('moment');
const schedule = require('node-schedule');

let Noticia = require('../controllers/noticia')
let NoticiaProg = require('../controllers/noticiaProgramada')

var jobs = {}

// calcular data da próxima publicação
function proxData(recorrencia, data_inicial) {
    let unidades_tempo = ['years','months','days','hours','minutes','seconds']

    let nova_data = new Date(data_inicial)
    recorrencia.map((x,i) => {nova_data = moment(nova_data).add(x, unidades_tempo[i]).toDate()})

    return nova_data.toISOString()
}

// programar uma notícia para ser publicada numa certa data futura
function programarNoticia(noticiaProg) {
    let data = new Date(noticiaProg.data_pub)
    let data_atual = new Date().toISOString()

    // só se for para publicar numa data futura
    if (noticiaProg.data_pub > data_atual) {
        let job = schedule.scheduleJob(data, function(n) {
            // atualizar as datas da nova iteração da notícia a publicar
            n.noticia.data_criacao = n.data_pub
            n.noticia.data_ultima_mod = n.data_pub
            
            Noticia.inserir(JSON.parse(JSON.stringify(n.noticia)))
                .then(dados => {
                    console.log(`Notícia programada '${n.noticia.titulo}' publicada com sucesso em ${n.data_pub}.`)

                    // se não for recorrente, remover a sua entrada da tabela de notícias programadas
                    if (n.recorrencia.every(x => x===0)) {
                        NoticiaProg.remover(n._id)
                            .then(d => console.log(`Programação da notícia '${n.noticia.titulo}' terminada com sucesso.`))
                            .catch(e => console.log(`Erro ao terminar a programação da notícia '${n.noticia.titulo}'.`))
                    }
                    // caso contrário, atualiza a data da próxima publicação, para conseguir recuperar caso haja uma falha do sistema, e programa a próxima iteração
                    else {
                        n.data_pub = proxData(n.recorrencia, data)
                        if (!("id_original" in n.noticia)) n.noticia.id_original = dados._id

                        NoticiaProg.atualizar(n)
                            .then(d => {
                                console.log(`Data da próxima publicação da notícia programada '${n.noticia.titulo}' atualizada com sucesso para ${n.data_pub}.`)
                                programarNoticia(n)
                            })
                            .catch(e => console.log(`Erro ao atualizar a data da próxima publicação da notícia programada '${n.noticia.titulo}'.`))
                    }
                })
                .catch(e => console.log(`Erro ao publicar a notícia programada '${n.noticia.titulo}' em ${n.data_pub}.`))
        }.bind(null, noticiaProg))
        
        jobs[noticiaProg._id] = job
    }

    console.log(`Nova notícia '${noticiaProg.noticia.titulo}' programada com sucesso para ${noticiaProg.data_pub}.`)
    return true
}

// agendar de novo todas as notícias programadas
function reporProgramacoes() {
    NoticiaProg.listar()
        .then(dados => dados.map(x => noticiasEmAtraso(x)))
        .catch(e => console.log("Erro ao repor as programações de todas as notícias programadas."))
}

// publicar todas as iterações da notícia em atraso que não foram publicadas enquanto o servidor estava desligado
function noticiasEmAtraso(n) {
    let data_atual = new Date().toISOString()

    if (n.data_pub <= data_atual) {
        n.noticia.data_criacao = n.data_pub
        n.noticia.data_ultima_mod = n.data_pub
        
        Noticia.inserir(JSON.parse(JSON.stringify(n.noticia)))
            .then(dados => {
                console.log(`Notícia programada '${n.noticia.titulo}' publicada com sucesso em ${n.data_pub}.`)

                n.data_pub = proxData(n.recorrencia, n.data_pub)
                if (!("id_original" in n.noticia)) n.noticia.id_original = dados._id

                if (n.recorrencia.some((x) => x !== 0)) noticiasEmAtraso(n)
                else {
                    NoticiaProg.remover(n._id)
                        .then(d => console.log(`Programação da notícia '${n.noticia.titulo}' terminada com sucesso.`))
                        .catch(e => console.log(`Erro ao terminar a programação da notícia '${n.noticia.titulo}'.`))
                }
            })
            .catch(e => console.log(`Erro ao publicar a notícia programada '${n.noticia.titulo}' em ${n.data_pub}.`))
    }
    else {
        // quando já tiver publicado todas as iterações em atraso, atualiza a data da próxima na bd e programa-a
        NoticiaProg.atualizar(n)
            .then(d => {
                console.log(`Data da próxima publicação da notícia programada '${n.noticia.titulo}' atualizada com sucesso para ${n.data_pub}.`)
                programarNoticia(n)
            })
            .catch(e => console.log(`Erro ao atualizar a data da próxima publicação da notícia programada '${n.noticia.titulo}'.`))
    }
}

function reagendar(n) {
    jobs[n._id].cancel()
    programarNoticia(n)
}

// cancelar a próxima publicação programada de uma notícia
function cancelarProgramacao(id) {
    jobs[id].cancel()
    console.log(`Programação da notícia '${id}' terminada com sucesso.`)
}

// atualizar uma notícia programada - criar uma nova a partir de uma normal ou editar uma existente
function atualizarNoticiaProg(noticiaProg, res) {
    // programada -> programada
    if ("_id" in noticiaProg) {
        NoticiaProg.atualizar(noticiaProg)
            .then(d => {
                np.reagendar(noticiaProg)
                return res.status(200).jsonp(d)
            })
            .catch(e => res.status(500).jsonp({error: `Ocorreu um erro ao atualizar a notícia programada '${noticiaProg.noticia.titulo}'.`}))
    }
    // normal -> programada
    else {
        noticiaProg.id_original = noticiaProg.noticia._id
        noticiaProg.noticia.original = false

        NoticiaProg.inserir(noticiaProg)
            .then(notProg => {
                noticiaProg._id = notProg._id
                programarNoticia(noticiaProg)

                return res.status(200).jsonp(notProg)
            })
            .catch((e) => res.status(500).jsonp({ error: `Ocorreu um erro ao programar a notícia '${noticiaProg.noticia.titulo}'.` }))
    }
}

module.exports = {
    proxData,
    programarNoticia,
    reporProgramacoes,
    reagendar,
    cancelarProgramacao,
    atualizarNoticiaProg
}