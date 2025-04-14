import session from 'express-session'

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'secretoSeguro',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 86400000 }
})

export { sessionMiddleware }
