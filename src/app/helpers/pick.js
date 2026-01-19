const mongoose = require("mongoose");

const pick = (obj, fields, model = null) => {
  const finalObj = {};

  for (const field of fields) {
    if (obj && obj[field]) {
      const value = obj[field];

      if (model) {
        const fieldType = model.schema.path(field)
          ? model.schema.path(field).instance
          : "String";

        switch (fieldType) {
          case "Boolean":
            finalObj[field] = value === "true";
            break;
          case "Number":
            finalObj[field] = isNaN(Number(value)) ? value : Number(value);
            break;
          case "String":
            finalObj[field] = String(value);
            break;
          case "ObjectId":
            finalObj[field] = new mongoose.Types.ObjectId(value);
            break;
          default:
            finalObj[field] = value;
            break;
        }
      } else {
        finalObj[field] = String(value);
      }
    }
  }

  return finalObj;
};

module.exports = pick;
