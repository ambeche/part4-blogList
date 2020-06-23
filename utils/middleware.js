const morganLogger = require('morgan')
const logger = require('./logger')

morganLogger.token('data', (req) =>  JSON.stringify(req.body))

const errorHandler = (error, req, res, next) => {
    logger.err(error.message)
    if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }
    next(error)
}

const unknownRoute = (req, res) => {
    res.status(404).send('No Resource, Endpoint Unknown')
}

module.exports = { morganLogger, errorHandler, unknownRoute}