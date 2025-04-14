
import helmet from 'helmet'

const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],
            connectSrc: ["'self'"]
        }
    }
})

export { helmetMiddleware }