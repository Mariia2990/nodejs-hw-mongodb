import { ContactsCollections } from '../db/models/contact.js';

export const getAllContacts = async () => {
  return await ContactsCollections.find();
};
export const getContactById = async (contactId) => {
  return await ContactsCollections.findById(contactId);
};
