const crypto = require("crypto");
const { keyencriptacion, keyiv } = require("../config");

const algorithm = 'aes-256-cbc'; // Algoritmo de cifrado

// Convertimos las claves de hexadecimal a Buffer
const secretKey = Buffer.from(keyencriptacion, 'hex');
const iv = Buffer.from(keyiv, 'hex');

// Función para cifrar
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Función para descifrar
function decrypt(encryptedText) {
    try {
        const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    } catch (error) {
        console.error('Error al desencriptar:', error);
        throw error; // Re-lanza el error si deseas manejarlo en otro lugar
    }
}

module.exports = { encrypt, decrypt };

