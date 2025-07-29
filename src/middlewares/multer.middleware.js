import multer from 'multer'
//disk storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.originalname)//it give original name of file and it override but we delete fromserver from few saccond
  }
})

// export const upload = multer({ storage: storage })
export const upload = multer({storage})