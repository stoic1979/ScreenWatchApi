const mongoose = require('mongoose');

const ScreenShotSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
	},
	project: {
		type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project'
	},
	memo: {
		type: String,
		required: true
	},
	img: {
		type: String,
		required: true
	},
	created_at: Date,
	
	});

//--------------------------------------------------------------------
// We can use the Schema pre method to have operations happen before
// an object is saved
//--------------------------------------------------------------------
ScreenShotSchema.pre('save', function(next){

    var screenShot = this; // this refers to ScreenShotSchema object

    var currentDate = new Date();
    if (!screenShot.created_at) {
       screenShot.created_at = currentDate;
    }

	
   	next();
});

module.exports = mongoose.model("ScreenShot", ScreenShotSchema);