
import multer from 'multer'
import path from 'path'

const storage = multer.memoryStorage()

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    // Strict validation to ensure only CSV and Excel formats are accepted
    if (ext == '.csv' || ext === '.xlsx' || ext === '.xls' || ext === '.axls') {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
    }
  }
})