const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: String,
    password: String
});

UserSchema.methods.encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPass = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('users', UserSchema);