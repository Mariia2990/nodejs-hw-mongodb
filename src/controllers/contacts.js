import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { _id: userId, role } = req.user;
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const contacts = await getAllContacts({
    userId,
    role,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const {_id: userId} = req.user;
    const contact = await getContactById(contactId, userId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  const { _id: userId } =req.user;
  const { name, phoneNumber, contactType } = req.body;
  if (!name || !phoneNumber || !contactType) {
    return res.status(400).json({
      status: 400,
      message: 'Name, Phone number and Contact type are required.'
    });
  }

  const payload = {
    ...req.body,
    userId,
  };

    const contact = await createContact(payload);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const result = await updateContact(contactId, userId, req.body);
    if (!result) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }
    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: result.contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { contactId } = req.params;
    const contact = await deleteContact(userId, contactId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


