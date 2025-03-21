export const handleAsync = (requestHandler) => {

    return (req, res, next) => Promise.resolve(requestHandler(req, res, next)).catch(error => next(error))
}