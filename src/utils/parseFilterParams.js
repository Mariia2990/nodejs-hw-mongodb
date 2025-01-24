const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);
  if (isContactType(contactType)) return contactType;
};

const parseIsFavourite = (isFavourite) => {
  const isString = typeof isFavourite === 'string';
  if (!isString) return;
  const favourite = isFavourite.toLowerCase();
  if (favourite === 'true') return true;
  if (favourite === 'false') return false;
};

export const parseFilterParams = (query) => {
    const { contactType, isFavourite } = query;
    const parsedContactType = parseContactType(contactType);
    const parsedIsFavourite = parseIsFavourite(isFavourite);
    return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
    };
};
