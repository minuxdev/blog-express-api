import dotenv from "dotenv";
import multerGoogleStorage from "multer-cloud-storage";
import multer from "multer";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const uploadHandler = multer({
  storage: multerGoogleStorage.storageEngine({
    acl: "publicRead",
    bucket: process.env.GCS_BUCKET,
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: serviceAccount,
    destination: "minuxblog/",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});

export default uploadHandler;
