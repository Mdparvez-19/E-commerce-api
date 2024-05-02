const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name field can't be empty"],
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail]
        },
        role: {
            type: String,
            enum: ["user", "merchant", "admin"],
            default: "user"
        },
        password: {
            type: String,
            required: [true, "password field can't be empty"],
            minlength: [8, "password should be of minimum 8 characters"],
        },
        confirmPassword: {
            type: String,
            select: false,
            validate: {
                validator: function (value) {
                    return this.password === value
                },
                message: "password doesn't match"
            }
        },
        passWordChangedAt: Date,
        hashedToken: String,
        passwordResetTokenExpiresAt: Date
    },
    {
        timestamps: true
    }
);

//hashing the password
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//comparing the password
userSchema.methods.comparePassword = async function (pwd, dbPwd) {
    return await bcrypt.compare(pwd, dbPwd);
}

//generate token to reset password
userSchema.methods.resetToken = async function () {
    const token = await crypto.randomBytes(32).toString('hex');
    this.hashedToken = crypto.createHash('sha256', process.env.SECRET_STRING)
        .update(token).digest('hex');
    this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;

    // console.log(token);
    // console.log(this.hashedToken);
    // console.log(this.passwordResetTokenExpiresAt);
    return token;
}

module.exports = model("user", userSchema);
