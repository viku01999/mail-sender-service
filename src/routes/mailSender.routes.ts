import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { MailSenderController } from '../controller/MailSenderController';

const router = Router();
const mailSenderController = new MailSenderController();
const upload = multer({
  limits: {
    fileSize: 25 * 1024 * 1024,
  }
});

const handlerWrapper = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
};

router.post('/send-email', upload.array('attachments'), handlerWrapper(mailSenderController.sendEmailWithHeaders.bind(mailSenderController)));

export default router;
