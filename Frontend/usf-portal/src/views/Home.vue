<template>
  <div class="home">
    <Noticia v-for="(noticia,n) in noticias" :noticia='noticia' :key="n" />
  </div>
</template>

<script>
import Noticia from "../components/Noticia.vue"

export default {
  name: 'Home',
  components: {
    Noticia
  },
  data () {
    return {
      noticias: [
        {
          title: "Conflitos éticos",
          text: `Sabia que existe a possibilidade de pedir parecer sobre questões éticas na saúde e no âmbito da investigação clinica, à Comissão de Ética para a Saúde (CES)?

Estes conflitos éticos podem surgir em questões de respeito pela dignidade humana, integridade pessoal, justiça e a equidade, liberdade e a autonomia, entre outro.

O nosso panfleto pretende ajudar a esclarecê-lo! Não hesite em consultá-lo. `,
          attachments: ["https://1.bp.blogspot.com/-BREapjKunuI/YC5aGcDTuUI/AAAAAAAAHQg/xPNCACPL-bEcUseejFryoUTXJ0u-zCQSwCNcBGAsYHQ/s518/7346147_CONFLITO.jpg"],
          autor: "Jorge Costa",
          data: "11/11/2021"
        },
        {
          title: "DIA MUNDIAL DA SAÚDE",
          text: `Sabia que hoje comemoramos o dia mundial da Saúde?

Nesse sentido, a Direção Geral de Saúde preparou uma sessão dedicada a este dia. 

A sessão pode ser visualizada no seguinte link.`,
          attachments: ["https://1.bp.blogspot.com/-uXs9ssoNCx8/YG4ey3Dyo9I/AAAAAAAAHUw/EDNXGwVmY5cd71cA49tfDp2f6F1tZDPpQCNcBGAsYHQ/s1920/169976392_3971002472922344_6567909077237891199_n.jpg"],
          autor: "Jorge Costa",
          data: "13/07/2021"
        },
        {
          title: "GUIA PARA LANCHES SAUDÁVEIS!",
          text: `A Direção-Geral da Saúde e a Direção-Geral da Educação publicam hoje um guia sobre lanches escolares saudáveis, assinalando o regresso ao ensino presencial de muitas crianças e jovens. Pode consultar o manual no seguinte link.`,
          attachments: ["https://1.bp.blogspot.com/-bIAE5avXsDg/YGudKRVlRCI/AAAAAAAAHUY/sR-ID2R4qEkeW1eDJU6kruOkoxEtwTghgCNcBGAsYHQ/s789/Guia_Lanches.png"],
          autor: "Ana João",
          data: "31/11/2020"
        }
      ]
    }
  }
}
</script>
