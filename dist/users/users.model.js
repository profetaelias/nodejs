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
// a função passada para o pre deve ser uma função tradicional e não uma arrow function para não interferir no this
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        console.log('modificado');
        next();
    }
    else {
        bcrypt.hash(user['password'], environment_1.environment.security.saltRounds)
            .then(hash => {
            user['password'] = hash;
            console.log(user['password']);
            next();
        })
            .catch(next);
    }
});
exports.User = mongoose.model('User', userSchema);
