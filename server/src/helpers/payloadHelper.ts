import { InvalidPayload } from '../config/errorTypes/SystemErrors';

function validUpdateUserPayload(obj: any) {
  const validKeys = ['email', 'tradeLink'];
  const validPayload = validKeys.reduce((filteredObj: any, key: any) => {
    if (key in obj) {
      filteredObj[key] = obj[key];
    }
    return filteredObj;
  }, {});

  if (Object.keys(validPayload).length > 0) {
    return validPayload;
  } else {
    throw new InvalidPayload();
  }
}

export { validUpdateUserPayload };
