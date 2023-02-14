const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");

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
            finished: false
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
}

module.exports = new AppointmentService();

