const express = require("express");
const SecretController = require("./secret.controller");
const validateRequest = require("../../middlewares/validateRequest");
const {
  createSecretSchema,
  checkSecretSchema,
  revealSecretSchema,
} = require("./secret.validation");

const router = express.Router();

// Create a new secret
router.post(
  "/",
  validateRequest(createSecretSchema),
  SecretController.createSecret
);

// Check if secret exists (metadata only, doesn't delete)
router.get(
  "/:id",
  validateRequest(checkSecretSchema),
  SecretController.checkSecret
);

// Reveal and destroy secret
router.post(
  "/:id/reveal",
  validateRequest(revealSecretSchema),
  SecretController.revealSecret
);

module.exports = router;
