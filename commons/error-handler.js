
function errorHandler(err, req, res, next) {
    console.log("ERROR_____:", err);
    console.log("ERROR NAME_____:", err?.name);
    console.log("ERROR TYPE_____", err?.type);
    console.log("ERROR NO: ", err?.errno);
    console.log("ERROR CODE_____: ", err?.code)

    return res.status(500).json({ status:"failed", message: err })

    if (err.code === 404) {
        res.status(404).json({ status:"failed", message: err })
    }
   
    if(err.code=='ER_PARAMETER_UNDEFINED'){
        return res.status(500).json(err_message.somethingWentWrongWithReason(err))

    }

    
    if (err.name === 'SqlError') {
        console.error("EEEEERRROR__:", JSON.stringify(err))
        if(err?.errno === 1146) {
            return res.status(403).json(err_message.featureNotAvailable("DBE-002"));
    
        }
        if(err?.errno === 1062) {
            return res.status(403).json(err_message.duplicateName());
        }
        // validation error
        return res.status(500).json(err_message.somethingWentWrong("DBE-001"));
    }

    if(err.name === 'ClickhouseError') {
        if(err.code === "60"){
            return res.status(403).json(err_message.featureNotAvailable("DBE-003"));
        }
        return res.status(500).json(err_message.somethingWentWrong("DBE-004"));

    }
   
   

    if (err.name === 'ValidationError') {
        // validation error
        return res.status(400).json(err_message.missingRequestParamWithReason(err));
    }
    
    if (err.name === 'SyntaxError') {
        // validation error
        return res.status(400).json(err_message.badRequestSomeWentWrongWithReason(err));
    }
   

    if (err.name === 'UnauthorizedError' || err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        // jwt authentication error
        return res.status(401).json(err_message.unauthorized())
    }
    if(err.message === 'record not found'){
        return res.status(404).json(err_message.recordNotFound());
    }
    if (typeof (err) === 'string') {
        // custom application error
        console.log(err.message)
        return res.status(500).json(err_message.somethingWentWrongWithReason(err));
    }
    
    if (err.code === 'ER_DUP_ENTRY') {
        console.error("EEEEERRROR__12:", JSON.stringify(err))
        if(err?.errno === 1146) {
            return res.status(403).json(err_message.featureNotAvailable("DBE-002"));
    
        }
      
        // validation error
        console.log("SomethingWentWringLogic");
        return res.status(500).json(err_message.somethingWentWrong("DBE-001"));
    }

    // default to 500 server error
    return res.status(500).json(err_message.somethingWentWrongWithReason(err))

}

module.exports = errorHandler;