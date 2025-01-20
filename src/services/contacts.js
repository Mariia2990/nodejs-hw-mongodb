import { ContactsCollections } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollections.find();
  return contacts;
};
export const getContactById = async (contactId) => {
  const contact = await ContactsCollections.findById(contactId);
  return contact;
};
export const createContact = async (payload) => {
  const contact = await ContactsCollections.create(payload);
  return contact;
};
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollections.findOneAndUpdate(
    {
      _id: contactId,
    },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  return rawResult;
  // if (!rawResult || !rawResult.value) return null;
  // return {
  //   contact: rawResult.value,
  //   isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  // };
};
export const deleteContact = async (contactId) => {
  const contact = await ContactsCollections.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};
