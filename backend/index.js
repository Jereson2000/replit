const express = require("express");
const morgan = require("morgan");
const PORT = process.env.PORT || 3001;
const app = express();

const morganConf = morgan((tokens, req, res) =>
  [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    JSON.stringify(req.body),
  ].join(" "),
);

app.use(express.static("dist"));
app.use(express.json());
app.use(morganConf);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).json({ error: "requested person not found" });
  }

  res.json(person);
});

app.get("/info", (req, res) => {
  const date = Date().toString();
  const data = `
    <p>Phonebook has info for ${persons.length} people
    <p>${date}<p>
    `;
  res.send(data);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  persons = persons.filter((person) => person.id !== id);

  res.json(person);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res
      .status(400)
      .json({ error: "name must be defined in request body" });
  }

  if (!body.number) {
    return res
      .status(400)
      .json({ error: "number must be defined in request body" });
  }

  if (persons.find((person) => person.name === body.name.toString())) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const id = Math.floor(Math.random() * Number.MAX_VALUE);

  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
