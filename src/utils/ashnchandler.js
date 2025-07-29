const asyncHandler=((requestHandler)=>{
  return  (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>{
            next(err)
        })
        
    }

})
// export default asyncHandler
export {asyncHandler}


// const asyncHandler1=(fn)=>{
//     return (req,res,next)=>{
//         fn(req,res,next).catch(next)
//     }
// }
