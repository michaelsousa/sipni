const axios = require('axios');

const acesso = [
 "dGhpYWdvZXdlcnNvbkBnbWFpbC5jb206dGhpYWdvMjc=",
// "ZWxpZW5lc291c2FzanNAZ21haWwuY29tOnNtczEwMjYwMg==",
// "Y21zbWFyaWFjcmlzdGluYXJvbWFAZ21haWwuY29tOkx1aXoxMjM=",
// "ZW5mcGxtb3JlaXJhQGdtYWlsLmNvbToyMXNhdWRlcHNtYQ==",
// "YnJ1bmFwYXRyaWNpYTFAaG90bWFpbC5jb206YnJ1bmExMA==",
// "c2lybGVuZW9saXZlaXJhb2xpdmVpcmE3MTRAZ21haWwuY29tOlNhdWRlMjAyMUA=",
/* "Y2ludGlhc2lsdmEwMDAzQGdtYWlsLmNvbTpjaW50aWExOTk2",
 "aGVsZW5hYmVsYTc4OUBnbWFpbC5jb206SDQ0MjExNTQ4",
 "bGVpbmFkZWxpc2lvMTJAZ21haWwuY29tOnI3c2F1ZGU=",
 "bmFuY3lsbGZAaG90bWFpbC5jb206Y292aWQxOTEyMw==",
 "bG11cnRhMDA3QGdtYWlsLmNvbTpTYXVkZTIwMjFA",
 "bHVpemEuY2F2YWxjYW50ZTg4QGdtYWlsLmNvbTpkZWJvcmExMjM=",
 "YnJ1bmFwYXRyaWNpYTFAaG90bWFpbC5jb206YnJ1bmExMA==",
 "YmV0aGFuaWFwYUBnbWFpbC5jb206YmV0aGFuaWEyMDIw",
 "bWVyY2luaGEtZ29uY2FsdmVzQGhvdG1haWwuY29tOjEyMzQ1NlZF",
 "cmFpc3NhY2FyZG96b2Z1cnRhZG9icmFnYUBnbWFpbC5jb206cjI0NDgxOA==",
 "bWlyaWFuanVsaWFvMjAxMUBnbWFpbC5jb206Y292aWQxOQ==",
 "aGVsZW5hYmVsYTc4OUBnbWFpbC5jb206SDQ0MjExNTQ4",
 "YW5kcmVzc2Fjb2xpdmVpcmE0QGdtYWlsLmNvbTphbmRyZXNzYTIx",
 "amVzc2ljYXBhdWxpbm9fMjVAaG90bWFpbC5jb206amVzc2ljYTIwMjE=",
 "ZHIuZmxhdmlvcmliZWlybzI4QGdtYWlsLmNvbTpjb3ZpZDE5",
 "ZW5mZXJtZWlyYWVtaWx5YUBnbWFpbC5jb206ZW1pNDMxOQ=="
*/
];

 async function Bearer() {
 console.log("TOKEN SOLICITADO")
   let user_senha = acesso[Math.floor(Math.random() * acesso.length)];
   const { data, error } = await axios({
     url: 'https://servicos-cloud.saude.gov.br/pni-bff/v1/autenticacao/tokenAcesso',
     method: 'POST',
     headers: {
       'accept': 'application/json',
       'X-Authorization': 'Basic ' + user_senha,
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
