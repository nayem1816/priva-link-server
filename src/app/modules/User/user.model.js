const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../../config/config");

const USER_ROLE = Object.freeze({
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
  SUPER_ADMIN: "super-admin",
});

const USER_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
});

const profilePictureSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: profilePictureSchema,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
  },
  { timestamps: true, versionKey: false }
);

// Pre-save middleware to hash password only on updates
userSchema.pre("save", async function (next) {
  const password = this.password;
  const isHashed = /^\$2[aby]?\$/.test(password);

  // If password is not hashed than hash it
  if (!isHashed && this.isModified("password")) {
    const saltRounds = Number(config.bcrypt_salt_rounds);
    this.password = await bcrypt.hash(password, saltRounds);
  }

  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;
  delete obj.status;
  delete obj.updatedAt;
  delete obj.__v;

  return obj;
};

const User = mongoose.model("User", userSchema);
module.exports = { User, USER_ROLE, USER_STATUS };
