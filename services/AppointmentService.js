const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");
const mailer = require("nodemailer");

const Appo = mongoose.model("Appointment", appointment);

class AppointmentService {

    async Create(name, email, description, cpf, date, time){
        var newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        });
        try{
            await newAppo.save()
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async GetAll(showFinished){
        
        if(showFinished){
            return await Appo.find();
        } else {
            var appos = await Appo.find({'finished': false});
            var appointments = [];

            appos.forEach(appointment => {
                if(appointment.date != undefined){
                    appointments.push(AppointmentFactory.Build(appointment))
                }
            })

            return appointments;
        }
    }

    async GetById(id){

        try{
            var appointment = await Appo.findOne({'_id': id});
            return appointment;
        }catch(err){
            console.log(err);
        }
    }

    async Finish(id){
        try{
            await Appo.findByIdAndUpdate(id,{finished: true});
            return true;
        }catch(err){
            console.log(err)
            return false;
        }
    }

    //Query => E-mail
    //Query => CPF
    async Search(query){
        try{
            var appos = await Appo.find().or([{email: query}, {cpf: query}])
            return appos;
        }catch(err){
            console.log(err)
            return [];
        }
    }

    async SendNotification(){

        var appos = await this.GetAll(false);

        var transporter = mailer.createTransport({
            host:"sandbox.smtp.mailtrap.io",
            port: 25,
            auth:{
                user:"752a26f97418ee",
                pass:"70f9c45d34931d"
            }
        });

        appos.forEach(async app => {
            var date = app.start.getTime();
            var hour = 1000 * 60 * 60;
            var gap = date-Date.now();

            if(gap <= hour){
                if(!app.notified){

                    await Appo.findByIdAndUpdate(app.id, {notified: true});

                    transporter.sendMail({
                        from: "Clinica MongoDB <clinica@email.com.br>",
                        to: app.email,
                        subject: "Sua consulta na Clinica MongoDB",
                        text:"Sua consulta vai acontecer em 1h!"
                    }).then(() => {

                    }).catch(err => {
                        console.log(err)
                    })
                }
            }
        })
    }
}

module.exports = new AppointmentService();

