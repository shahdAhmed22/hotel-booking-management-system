import multer from "multer"

export const multerHost = () => {
    // diskStorage
    const storage = multer.diskStorage({})
    const extensions=['jpg', 'jpeg', 'png', 'gif']
    // file Filter
    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('Image format is not allowed!'), false)
    }


    const file = multer({ fileFilter, storage })
    return file
}