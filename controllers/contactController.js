const asyncHandler=require("express-async-handler")
const Contact=require("../models/contactModel")
//@desc Get all Contacts
//@route GET /api/contacts
//@access private 


const getContact =asyncHandler(async (req,res)=>{
    const contacts= await Contact.find({user_id:req.user.id});
    res.status(201).json(contacts)
})

//@desc Get single Contact
//@route GET /api/contact/:id
//@access private 

const getSingleContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact Not Found");
    }
    res.status(200).json(contact)
}
)

//@desc POST a new Contact
//@route Post /api/contact/:id
//@access private 

const createContact =asyncHandler(async(req,res)=>{
    console.log(req.body)
    const {title,category,description}=req.body;
    if(!title || !category ||!description){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const contact=await Contact.create({
        title,
        category,
        description,
        user_id:req.user.id
    })
    res.status(201).json(contact)
})

//@desc PUT the Contact
//@route GET /api/contact/:id
//@access private 

const updateContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact Not Found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(400);
        throw new Error("User don't have the permission to update other contact")
    }
    const updatedContact=await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );

    res.status(200).json(updatedContact)
})

//@desc DELETE a Contact
//@route GET /api/contact/:id
//@access private 

const deleteContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id)
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(400);
        throw new Error("User don't have the permission to update other contact")
    }
    await Contact.deleteOne({_id:req.params.id});
    res.status(200).json(contact)
})


module.exports={getContact,getSingleContact,createContact,updateContact,deleteContact}