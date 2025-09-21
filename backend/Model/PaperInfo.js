const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  "College Name": { type: String, required: true },
  "Branch": { type: String, required: true },
  "Year Of Study": { type: String, required: true },
  "Semester": { type: String, required: true },
  "Course Name": { type: String, required: true },
  "Course Code": { type: String, required: true },
  "Course Teacher": { type: String, required: true },
  "Sequence": [],
  "Collected Data":[],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},{timestamps:true}); 

const PaperInfo = mongoose.model('PaperInfo', PaperSchema);

module.exports = PaperInfo;
