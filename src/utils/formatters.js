// src/utils/formatters.js

export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatInputValue = (name, value) => {
  if (name === 'email') {
    return value.toLowerCase();
  }
  
  // Fields to title case
  const titleCaseFields = [
    'hotelName', 'ownerName', 'city', 'district', 'state', 'postOffice', 'localThana', 'address', 'fullAddress'
  ];
  
  if (titleCaseFields.includes(name)) {
    return titleCase(value);
  }
  
  return value;
};
