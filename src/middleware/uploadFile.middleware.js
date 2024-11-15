function uploadFileMiddleware(isRequired = true) {
    return (req, res, next) => {
        if (isRequired) {
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    status: 400,
                    message: "File Not Uploaded, please upload a file",
                });
            }
        }
        if (isRequired && req.files) {
            if (Object.keys(req.files).length > 1) {
                return res.status(400).send('Please upload only one file.');
            }
        }
        
        if (req.files && !isRequired) {
            if (Object.keys(req.files).length > 1) {
                return res.status(400).send('Please upload only one file.');
            }
        }
        return next();
    };
}

export default uploadFileMiddleware;