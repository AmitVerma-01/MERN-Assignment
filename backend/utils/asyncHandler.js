const asyncHandler = (requestHandler) => async (req,res,next) => {
    Promise.resolve(requestHandler(req,res,next)).catch((err) => {
        console.log(err);
        return res
        .status(err.code || 500)
        .json({
            success : false,
            message : err.message,
            err : err
        })
    })
}

export {asyncHandler}
