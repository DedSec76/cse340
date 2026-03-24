const errorController = {}

errorController.buildError = async function (req, res, next) {
    const error = new Error("Error, server exploded - We're testing...")
    error.status = 500
    throw error
}

module.exports = errorController