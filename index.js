const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appointmentService = require("./services/AppointmentService");
const AppointmentService = require("./services/AppointmentService");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/agendamento", {useNewUrlParser: true, useUnifiedTopology: true});

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/appointments", async (req, res) => {
    var appointments = await AppointmentService.GetAll(false);
    res.json(appointments);
})

app.get("/details/:id", async(req, res) => {    
    var appointment = await AppointmentService.GetById(req.params.id);
    res.render("details", {appo: appointment});
})

app.get("/register", (req, res) => {
    res.render("create.ejs");
})

app.post("/create", async (req, res) => {

    var {name, email, description, cpf, date, time} = req.body;

    if(name == undefined || name == ''){
        console.log("Nome inválido");
        res.status(400);
        return;
    }

    if(email == undefined || email == ''){
        console.log("E-mail inválido");
        res.status(400);
        return;
    }

    if(description == undefined || description == ''){
        console.log("Descrição inválido");
        res.status(400);
        return;
    }

    if(cpf == undefined || cpf == ''){
        console.log("CPF inválido");
        res.status(400);
        return;
    }

    if(date == undefined || date == ''){
        console.log("Data inválida");
        res.status(400);
        return;
    }

    if(time == undefined || time == ''){
        console.log("Horário inválido");
        res.status(400);
        return;
    }

    var status = await appointmentService.Create(
        name,
        email,
        description,
        cpf,
        date,
        time
    )

    if(status){
        res.redirect("/")
    } else {
        res.status(400)
        res.send("Ocorreu uma falha!")
    }
})

app.listen(3000, () => {
    console.log("Servidor rodando");
})