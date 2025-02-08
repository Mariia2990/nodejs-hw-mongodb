import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollections } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  userId,
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = { userId };

  if (filter.contactType) {
    contactsQuery.contactType = filter.contactType;
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.isFavourite = filter.isFavourite;
  }

  const contactsCount = await ContactsCollections.countDocuments(contactsQuery);
  const contacts = await ContactsCollections.find(contactsQuery)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollections.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return await ContactsCollections.create(payload);
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const rawResult = await ContactsCollections.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      ...options,
    },
  );
  if (!rawResult) return null;
  return {
    contact: rawResult,
  };
};

export const deleteContact = async (contactId, userId) => {
  return await ContactsCollections.findOneAndDelete({ _id: contactId, userId });
};
