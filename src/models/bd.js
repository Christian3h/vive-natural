import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mascotaperla2018',
  database: 'vive_natural',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // conexiones idle m ximas, el valor predeterminado es el mismo que `connectionLimit`
  idleTimeout: 60000, // Tiempo de espera de conexiones inactivas, en milisegundos, el valor predeterminado es 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

export default pool