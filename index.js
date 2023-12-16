const express = require("express");

const { cpf_cns_Sipni } = require("./si-pni");

const app = express();

app.set("json spaces", 2);

app.get("/", (req, res) => {
  res.send("Ainda estamos em fase de criação");
});

app.get("/sipni/cpf_cns", (req, res) => {
  var { query } = req.query;
  cpf_cns_Sipni(query)
   .then((result) => {
     res.json(result);
   });
});


const port = 2727;
app.listen(port, (err) => {
  if (err) {
   console.log("Erro no servidor: " + port + "\n" + err);
  } else {
   console.log("WebSite Online na porta:", port);
  };
});