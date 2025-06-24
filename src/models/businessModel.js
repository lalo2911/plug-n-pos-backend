import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor ingrese un nombre para el negocio'],
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    inviteCodes: [{
        code: {
            type: String,
            required: true
        },
        isUsed: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    address: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Método para generar códigos de invitación
businessSchema.methods.generateInviteCode = async function () {
    // Generar un código de 8 caracteres aleatorios
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Agregar el código a la lista de códigos de invitación
    this.inviteCodes.push({ code });
    await this.save();

    return code;
};

export const Business = mongoose.model('Business', businessSchema);