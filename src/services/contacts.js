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

  const query = { userId };

  if (filter.contactType) {
    query.contactType = filter.contactType;
  }
  if (filter.isFavourite !== undefined) {
    query.isFavourite = filter.isFavourite;
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollections.countDocuments(query),
    ContactsCollections.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return ContactsCollections.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return ContactsCollections.create(payload);
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
  return ContactsCollections.findOneAndDelete({ _id: contactId, userId });
};
