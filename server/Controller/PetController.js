const Pet = require('../Model/PetModel');
const fs = require('fs');
const path = require('path');

const postPetRequest = async (req, res) => {
  try {
    const { name, age, area, justification, email, phone, type } = req.body;
    const pictureFilename = req.files && req.files.picture ? req.files.picture[0].filename : null;
    const medicalReportFilename = req.files && req.files.medicalReport ? req.files.medicalReport[0].filename : null;

    if (!pictureFilename) {
      return res.status(400).json({ error: "Picture is required" });
    }

    const pet = await Pet.create({
      name,
      age,
      area,
      justification,
      email,
      phone,
      type,
      filename: pictureFilename,
      medicalReportFilename: medicalReportFilename,
      status: 'Pending'
    });

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, phone, status } = req.body;
    const pet = await Pet.findByIdAndUpdate(id, { email, phone, status }, { new: true });

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.status(200).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const allPets = async (reqStatus, req, res) => {
  try {
    const data = await Pet.find({ status: reqStatus }).sort({ updatedAt: -1 });
    // Return array even if empty, don't throw error
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    // Delete picture file
    const picturePath = path.join(__dirname, '../images', pet.filename);
    if (fs.existsSync(picturePath)) {
      fs.unlinkSync(picturePath);
    }

    // Delete medical report file if it exists
    if (pet.medicalReportFilename) {
      const medicalReportPath = path.join(__dirname, '../images', pet.medicalReportFilename);
      if (fs.existsSync(medicalReportPath)) {
        fs.unlinkSync(medicalReportPath);
      }
    }

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  postPetRequest,
  approveRequest,
  deletePost,
  allPets
};
