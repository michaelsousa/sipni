const axios = require('axios');

const { Bearer } = require("./get_token");


 async function get_SiPini(url) {
   const { erro, token } = await Bearer();

   const { data, error } = await axios({
     url,
     method: 'GET',
     headers: {
       'Accept': 'application/json, text/plain, */*',
       'Authorization': 'Bearer ' + token,
       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
     }
   })
   .catch((error) => ({ error: error.message }));

   if (error) {
     return { erro: "Ops, estamos com um erro interno, por favor, tente novamente mais tarde!" };
   };
   if (data) {
     return { data };
   };
 };


 function cpf_cns_Sipni(cpf_cns) {
   return new Promise(async(resolve, reject) => {
     let ano = new Date().getYear();
     cpf_cns = cpf_cns.replace(/\D+/gi, "");
     let { data } = cpf_cns.length == 11 ? await get_SiPini('https://servicos-cloud.saude.gov.br/pni-bff/v1/cidadao/cpf/' + cpf_cns)
      : await get_SiPini('https://servicos-cloud.saude.gov.br/pni-bff/v1/cidadao/cns/' + cpf_cns);

     if (data?.records == undefined || data.records.length == 0) return resolve({
       status: false,
       erro: cpf_cns.length == 11 ? "CPF não encontrado!" : "CNS não encontrado!"
     });
     
       data = data.records[0];
               
       data['vip'] = data['vip'] ? "SIM" : "NÃO";
       data['ativo'] = data['ativo'] ? "SIM" : "NÃO";
       data['obito'] = data['obito'] ? "SIM" : "NÃO";
       data['partoGemelar'] = data['partoGemelar'] ? "SIM" : "NÃO";
       data['email'] = data['email'] == undefined ? [] : data['email'];
       data['sexo'] = data['sexo'] == "M" ? "MASCULINO" : data['sexo'] == "F" ? "FEMININO" : "INDEFINIDO";
       data['dataNascimento'] = data['dataNascimento'].replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
       data['idade'] = ((ano < 1000) ? ano + 1900 : ano) - data['dataNascimento'].split("/")[2];
       data['nomePai'] = data['nomePai'] == undefined ? "NÃO CONSTA" : data['nomePai'];
       data['nomeMae'] = data['nomeMae'] == undefined ? "NÃO CONSTA" : data['nomeMae'];

     const responseRacaCor = {
       "01": "BRANCA",
       "02": "PRETA",
       "03": "AMARELA",
       "04": "PARDA",
       "05": "INDIGENA"
     };
      data['racaCor'] = responseRacaCor[data['racaCor']] ?? "SEM INFORMAÇÃO";

     const ufNascimento = await get_SiPini('https://servicos-cloud.saude.gov.br/pni-bff/v1/municipio/' + data['nacionalidade']['municipioNascimento']);
      data['nacionalidade']['municipioNascimento'] = ufNascimento?.data?.record?.nome || "";

     const paisNascimento = data['nacionalidade']['paisNascimento'] == "1" ? "BRASIL" : await get_SiPini('https://servicos-cloud.saude.gov.br/pni-bff/v1/pais/' + data['nacionalidade']['paisNascimento']);
      data['nacionalidade']['paisNascimento'] = paisNascimento?.data?.record?.nome || paisNascimento;
               
     const residencia = data['endereco']['municipio'] == ufNascimento?.data?.record?.codigo ? ufNascimento?.data?.record?.nome
     :  await get_SiPini('https://servicos-cloud.saude.gov.br/pni-bff/v1/municipio/' + data['endereco']['municipio']);
      data['endereco']['municipio'] = residencia?.data?.record?.nome || residencia;

     const pais = data['endereco']['pais'] == "1" ? "BRASIL" : await get_SiPini('https://servicos-cloud.saude.gov.br/pni-bff/v1/pais/' + data['endereco']['pais']);
      data['endereco']['pais'] = pais?.data?.record?.nome || pais;

     const estado = {
       "RO": { "uf": "RONDÔNIA", "codigo": "1" },
       "AC": { "uf": "ACRE", "codigo": "1" },
       "AM": { "uf": "AMAZONAS", "codigo": "1" },
       "RR": { "uf": "Roraima", "codigo": "1" },
       "PA": { "uf": "PARÁ", "codigo": "1" },
       "AP": { "uf": "AMAPÁ", "codigo": "1" },
       "TO": { "uf": "TOCANTINS", "codigo": "1" },
       "MA": { "uf": "MARANHÃO", "codigo": "2" },
       "PI": { "uf": "PIAUÍ", "codigo": "2" },
       "CE": { "uf": "CEARÁ", "codigo": "2" },
       "RN": { "uf": "RIO GRANDE DO NORTE", "codigo": "2" },
       "PB": { "uf": "PARAÍBA", "codigo": "2" },
       "PE": { "uf": "PERNAMBUCO", "codigo": "2" },
       "AL": { "uf": "ALAGOAS", "codigo": "2" },
       "SE": { "uf": "SERGIPE", "codigo": "2" },
       "BA": { "uf": "BAHIA", "codigo": "2" },
       "MG": { "uf": "MINAS GERAIS", "codigo": "3" },
       "ES": { "uf": "ESPÍRITO SANTO", "codigo": "3" },
       "RJ": { "uf": "RIO DE JANEIRO", "codigo": "3" },
       "SP": { "uf": "SÃO PAULO", "codigo": "3" },
       "PR": { "uf": "PARANÁ", "codigo": "4" },
       "SC": { "uf": "SANTA CATARINA", "codigo": "4" },
       "RS": { "uf": "RIO GRANDE DO SUL", "codigo": "4" },
       "MS": { "uf": "MATO GROSSO DO SUL", "codigo": "5" },
       "MT": { "uf": "MATO GROSSO", "codigo": "5" },
       "GO": { "uf": "GOIÁS", "codigo": "5" },
       "DF": { "uf": "DISTRITO FEDERAL", "codigo": "5" }
     };
      data['endereco']['estado'] = estado[data['endereco']['siglaUf']].uf;
     
     data['endereco']['regiao'] = {
       "1": "NORTE",
       "2": "NORDESTE",
       "3": "SUDESTE",
       "4": "SUL",
       "5": "CENTRO-OESTE"
     }[
      estado[data['endereco']['siglaUf']].codigo
     ];

     function signo(input) {
       let [ dia, mes ] = input.split("/");
       if ((mes == 1 && dia >= 21) || (mes == 2 && dia <= 18)) output = "AQUÁRIO ♒️";
       else if ((mes == 2 && dia >= 19) || (mes == 3 && dia <= 20)) output = "PEIXES ♓️";
       else if ((mes == 3 && dia >= 21) || (mes == 4 && dia <= 20)) output = "ÁRIES ♈️";
       else if ((mes == 4 && dia >= 21) || (mes == 5 && dia <= 20)) output = "TOURO ♉️";
       else if ((mes == 5 && dia >= 21) || (mes == 6 && dia <= 20)) output = "GÊMEOS ♊️";
       else if ((mes == 6 && dia >= 21) || (mes == 7 && dia <= 22)) output = "CÂNCER ♋️";
       else if ((mes == 7 && dia >= 23) || (mes == 8 && dia <= 22)) output = "LEÃO ♌️";
       else if ((mes == 8 && dia >= 23) || (mes == 9 && dia <= 22)) output = "VIRGEM ♍️";
       else if ((mes == 9 && dia >= 23) || (mes == 10 && dia <= 22)) output = "LIBRA ♎️";
       else if ((mes == 10 && dia >= 23) || (mes == 11 && dia <= 21)) output = "ESCORPIÃO ♏️";
       else if ((mes == 11 && dia >= 22) || (mes == 12 && dia <= 21)) output = "SAGITÁRIO ♐️";
       else output = "CAPRICÓRNIO ♑️";
       return output;
     };
     data['signo'] = signo(data['dataNascimento']);

//     const responseCalendario = await get_SiPini('https://servicos-cloud.saude.gov.br/pni-bff/v1/calendario/cpf/' + data['cpf']);
//     let { indigena, calendario, outrasImunizacoes, imunizacoesCampanha } = responseCalendario?.data?.record;
//      data['vacinacao'] = {
//        indigena, calendario, outrasImunizacoes, imunizacoesCampanha
//      };
   
     resolve(data);
   });
 };

module.exports = { cpf_cns_Sipni };


