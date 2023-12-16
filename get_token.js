const axios = require('axios');

const acesso = [
 "enfplmoreira@gmail.com:21saudepsma",
 "thiagoewerson@gmail.com:thiago27",
 "jessicapaulino_25@hotmail.com:jessica2021",
 "lmurta007@gmail.com:Saude2021@",
 "sirleneoliveiraoliveira714@gmail.com:Saude2021@",
 "mercinha-goncalves@hotmail.com:123456VE",
 "nancyllf@hotmail.com:covid19123",
 "dr.flavioribeiro28@gmail.com:covid19",
 "mirianjuliao2011@gmail.com:covid19",
 "raissacardozofurtadobraga@gmail.com:r244818",
 "luiza.cavalcante88@gmail.com:debora123",
 "brunapatricia1@hotmail.com:bruna10",
 "andressacoliveira4@gmail.com:andressa21",
 "helenabela789@gmail.com:H44211548",
 "helenabela789@gmail.com:H44211548",
 "brunapatricia1@hotmail.com:bruna10",
 "cmsmariacristinaroma@gmail.com:Luiz123",
 "cintiasilva0003@gmail.com:cintia1996",
 "bethaniapa@gmail.com:bethania2020",
 "enfermeiraemilya@gmail.com:emi4319",
 "elienesousasjs@gmail.com:sms102602",
 "leinadelisio12@gmail.com:r7saude"
];

 async function Bearer() {
 console.log("TOKEN SOLICITADO")
   let user_senha = acesso[Math.floor(Math.random() * acesso.length)];
   const { data, error } = await axios({
     url: 'https://servicos-cloud.saude.gov.br/pni-bff/v1/autenticacao/tokenAcesso',
     method: 'POST',
     headers: {
       'accept': 'application/json',
       'X-Authorization': 'Basic ' + btoa(user_senha),
       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
     }
   })
   .catch((error) => ({ error: error.message }));
   
   if (error) {
     return { erro: "Ops, estamos com um erro interno, por favor, tente novamente mais tarde!\nAcesso: " + acesso };
   };
   if (data) {
     return { token: data['refreshToken'] };
   };
 };

module.exports = { Bearer };
