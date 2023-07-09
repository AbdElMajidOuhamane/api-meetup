const asyncHandler=require("express-async-handler")
const Contact=require("../models/contactModel")
//@desc Get all Contacts
//@route GET /api/contacts
//@access public 


const getContact =asyncHandler(async (req,res)=>{
    const contacts= await Contact.find();
    res.status(201).json(contacts)
})

const getSingleContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact Not Found");
    }
    res.status(200).json(contact)
}
)
const createContact =asyncHandler(async(req,res)=>{
    console.log(req.body)
    const {name,email,phone}=req.body;
    if(!name || !email ||!phone){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const contact=await Contact.create({
        name,
        email,
        phone,
    })
    res.status(201).json(contact)
})

const updateContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact Not Found");
    }
    const updatedContact=await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );

    res.status(200).json(updatedContact)
})

const deleteContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    await Contact.deleteOne();
    res.status(200).json(contact)
})


module.exports={getContact,getSingleContact,createContact,updateContact,deleteContact}