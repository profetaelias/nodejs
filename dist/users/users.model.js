"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const validator_1 = require("../common/validator");
const bcrypt = require("bcrypt");
const environment_1 = require("../common/environment");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validator_1.validateCPF,
            message: `{PATH}: Invalid CPF ({VALUE})`
        }
    }
});
//-associa o findByMail ao model.
//-não utilizar arrow functions para poder capturar o this 
// dinamicamente para ser possível o bind com o documento que for
// carregado
userSchema.statics.findByEmail = function (email, projection) {
    return this.findOne({ email }, projection); //{email: email}, projection
};
//-associa o matches a instância
//-não utilizar arrow functions para poder capturar o this 
// dinamicamente para ser possível o bind com o documento que for
// carregado
userSchema.methods.matches = function (password) {
    return bcrypt.compareSync(password, this.password);
};
const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment_1.environment.security.saltRounds)
        .then(hash => {
        obj.password = hash;
        next();
    })
        .catch(next);
};
const saveMiddleware = function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    else {
        hashPassword(user, next);
    }
};
const updateMiddleware = function (next) {
    if (!this.getUpdate().password) {
        next();
    }
    else {
        hashPassword(this.getUpdate(), next);
    }
};
// a função passada para o pre deve ser uma função tradicional e não uma arrow function para não interferir no this
userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);
exports.User = mongoose.model('User', userSchema);
