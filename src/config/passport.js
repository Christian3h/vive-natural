import passport from 'passport';
import dotenv from 'dotenv';
import pool from '../models/bd.js';
import crypto from 'crypto';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/sesion/auth/google/create"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [rows] = await pool.query('SELECT HEX(id) AS id, google_id, name, email, profile_picture, rol FROM usuarios WHERE google_id = ?', [profile.id])

        if (rows.length > 0) {
            return done(null, rows[0]) // Usuario encontrado en la BD
        } else {
            // Generar un UUID v4 y convertirlo a binario
            const uuidBuffer = crypto.randomUUID().replace(/-/g, '') // Eliminar guiones
            const uuidBinary = Buffer.from(uuidBuffer, 'hex') // Convertir a binario

            await pool.query(
                'INSERT INTO usuarios (id, google_id, name, email, profile_picture, rol) VALUES (?, ?, ?, ?, ?, ?)',
                [uuidBinary, profile.id, profile.displayName, profile.emails[0].value, profile.photos[0].value, 'usuario']
            )

            const newUser = {
                id: uuidBuffer, // Mantener el UUID en formato hexadecimal
                google_id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profile_picture: profile.photos[0].value,
                rol: 'user'
            }

            return done(null, newUser)
        }
    } catch (err) {
        return done(err, null)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})


// Deserializar el usuario
passport.deserializeUser(async (id, done) => {
    try {
        const idBuffer = Buffer.from(id, 'hex') // Convertir ID de hex a binario
        const [rows] = await pool.query('SELECT HEX(id) AS id, google_id, name, email, profile_picture, rol FROM usuarios WHERE id = ?', [idBuffer])

        done(null, rows.length > 0 ? rows[0] : null)
    } catch (error) {
        done(error, null)
    }
})

export default passport;
