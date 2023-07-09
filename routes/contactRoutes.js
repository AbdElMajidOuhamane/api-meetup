const express =require("express");
const { getContact, getSingleContact, createContact, updateContact, deleteContact } = require("../controllers/contactController");
const router =express.Router();

router.route('/').get(getContact).post(createContact)

router.route('/:id').get(getSingleContact).put(updateContact).delete(deleteContact)


module.exports = router