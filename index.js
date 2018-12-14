const express = require("express");
const knex = require("knex");
const server = express();

const dbConfig = require("./knexfile");

const PORT = 5000;
const db = knex(dbConfig.development);
server.use(express.json());

//INSERT INTO crayons (color, percent_used) VALUES ("red", .9)
server.post("/crayons", (req, res) => {
   const crayon = req.body;
   //db("tablename").insert({obj})
   db("crayons").insert(crayon)
      .then(ids => {
         res.status(201).json(ids)
      })
      .catch(err => {
         console.log(err)
         res.status(500).json({err: "failed to add crayon"})
      });
});

//SELECT * FROM crayons
server.get("/crayons", (req, res) => {
   db("crayons")
      .then(rows => {
         res.json(rows);
      })
      .catch(err => {
         res.status(500).json({err: "failed to get crayons"})
      });
});

//SELECT * FROM crayons WHERE id = :id
server.get("/crayons/:id", (req, res) => {
   const {id} = req.params;
   db("crayons").where("id", id)
      .then(rows => {
         res.json(rows);
      })
      .catch(err => {
         res.status(500).json({err: "failed to get crayon"})
      });
});

//UPDATE crayons SET perc_used = .75 WHERE id = :id
server.put("/crayons/:id", (req, res) => {
   const {id} = req.params;
   const crayons = req.body;
   db("crayons").where("id", id).update(crayons)
      .then(rowCount => {
         res.json(rowCount);
      })
      .catch(err => {
         res.status(500).json({err: "failed to update crayon"})
      });
});

//DELETE FROM crayons WHERE id = :id
server.delete("/crayons/:id", (req, res) => {
   const {id} = req.params;
   db("crayons").where("id", id).del()
      .then(rowCount => {
         res.status(201).json(rowCount);
      })
      .catch(err => {
         res.status(500).json({err: "failed to delete crayon"})
      });
});

server.listen(PORT, () => {
   console.log(`server running on ${PORT}`)
});