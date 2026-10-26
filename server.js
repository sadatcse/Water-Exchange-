import { createServer } from 'http'
import next from 'next'

// `npm run dev` uses `next dev`; this server runs in production unless NODE_ENV=development
const dev = process.env.NODE_ENV === 'development'
// Passenger (cPanel) passes PORT, sometimes as a socket path, so it isn't parsed as a number
const port = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            await handle(req, res)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })
        .once('error', (err) => {
            console.error(err)
            process.exit(1)
        })
        .listen(port, () => {
            console.log(`> Ready on ${port}`)
        })
})
