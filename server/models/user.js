import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    mail: String,
    name: String,
    password: String,
    level: {
        type: Date,
        default : 0
    },
},
{
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' }
})

const User = mongoose.model('Users', userSchema);

export default User;