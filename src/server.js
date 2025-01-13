import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import { ContactCollection } from './contacts/contacts.js';


dotenv.config();
const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = async() => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

 app.get('/contacts', async (req, res, next) => {
   try {
     const getAllContacts = await ContactCollection.find({});
     res.status(200).json({
       status: 200,
       message: 'Successfully found contacts!',
       data: getAllContacts,
     });
   } catch (error) {
     next(error);
   }
 });
  
   app.get('/contacts/:contactId', async (req, res, next) => {
     try {
       const { contactId } = req.params;
       const getContactById = await ContactCollection.findById(contactId);

       if (!getContactById) {
         return res.status(404).json({
           message: 'Contact not found',
         });
       }

       res.status(200).json({
         status: 200,
         message: 'Successfully found contact with id {contactId}!',
         data: getContactById,
       });
     } catch (error) {
       next(error);
     }
   });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};


export default setupServer;