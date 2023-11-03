export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const parseErrorMsg = (errMsg) => {
  var returStr = "";
  let startPos = JSON.stringify(errMsg).search("message");
  if (startPos >= 0) {
    let subStr = errMsg.substring(startPos + 4, errMsg.length)
    let endPos = subStr.indexOf("\"");
    if (endPos >= 0) {
      subStr = subStr.substring(0, endPos);
      returStr = subStr;
    }
  } else returStr = errMsg;
  return returStr;
}


export const getPercentFromType = (type) => {
  switch (type) {
    case 1:
      return 16;
    case 2:
      return 19;
    case 3:
      return 24;
    case 4:
      return 60;
    default:
      return 100;
  }
  return 0;
}

export const getPeriodFromType = (type) => {
  switch (type) {
    case 1:
      return 15;
    case 2:
      return 30;
    case 3:
      return 45;
    case 4:
      return 60;
    default:
      return 100;
  }
  return 0;
}