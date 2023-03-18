const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/User");
const config = require("../config");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const moment = require("moment");
const isUser = require("../middlewares/isUser");
const isAdmin = require("../middlewares/isAdmin");
const Appointment = require("../models/Appointment");


//registering a user
router.post("/userregister", async (req, res) => {
	const password = req.body.password;
	const email=req.body.email;
	const firstname=req.body.firstname;
	const lastname=req.body.lastname;
	const confPassword=req.body.confPassword;
	const mobilenum=req.body.mobilenum;
	const lat = req.body.lat;
	const long = req.body.long;
	const admin=false;

	if (!password || !email || !firstname || !lastname || !confPassword || !mobilenum, !lat, !long)
		return res.status(400).send("One or more of the fields are missing.");

	//checking for multiple accounts for a single email
	const emailcheck= await User.find({email:email});
	if(emailcheck.length >0) return res.status(400).send("Only one account per email address is allowed");

	if(password!=confPassword) return res.status(400).send("Password and Confirm Password do not match");

	// add user
	bcrypt.hash(password, saltRounds, async function(err, hash) {
		const newUser = new User({password:hash, firstname,lastname,email,mobilenum,admin,lat,long });
		return res.json(await newUser.save());
	});
	
});

router.post("/userlogin", async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		return res.status(400).send("Missing email or password");

	// checking if email exists
	const emails = await User.find({ email: email });
	if (emails.length === 0) return res.status(400).send("Email is incorrect");

	const user = emails[0];

	bcrypt.compare(password, user.password, async function(err, result) {
		if(result==false) return res.status(400).send("Incorrect password");

		// sending token
		const token =jwt.sign(
		{
			id: user._id,
		},
		config.jwtSecret,{expiresIn:"1d"}
		);
		res.setHeader("token", token);
		const name=user.firstname;
		res.json({ user,token });
	});
});


//register a professional
router.post("/profregister", async (req, res) => {
	const password = req.body.password;
	const email=req.body.email;
	const firstname=req.body.firstname;
	const lastname=req.body.lastname;
	const confPassword=req.body.confPassword;
	const mobilenum=req.body.mobilenum;
	const lat = req.body.lat;
	const long = req.body.long;
	const address = req.body.address;
	const category = req.body.category;
	const fee = req.body.fee;
	const experience = req.body.experience;
	const timings = req.body.timings;
	const duration = req.body.duration;
	const slot = req.body.slot;
	const admin=true;

	if (!password || !email || !firstname || !lastname || !confPassword || !mobilenum, !lat, !long , !address, !category, !fee, !experience, !timings, !duration , !slot)
		return res.status(400).send("One or more of the fields are missing.");

	//checking for multiple accounts for a single email
	const emailcheck= await User.find({email:email});
	if(emailcheck.length >0) return res.status(400).send("Only one account per email address is allowed");

	if(password!=confPassword) return res.status(400).send("Password and Confirm Password do not match");

	// add user
	bcrypt.hash(password, saltRounds, async function(err, hash) {
		const newUser = new User({password:hash, firstname,lastname,email,mobilenum,admin,lat,long,address,category,fee,experience,timings,duration ,slot });
		return res.json(await newUser.save());
	});
	
});

//Book appointments
router.post("/book-appointment", isUser, async (req, res) => {
	try {
	  req.body.status = "pending";
	  req.body.userId = req.auth.user._id;
	  req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
	//   req.body.time = moment(req.body.time, "HH:mm").toISOString();
	  const user = await User.findById(req.body.professionalId);
	  req.body.duration = user.duration;
	  const newAppointment = new Appointment(req.body);
	  await newAppointment.save();
	  res.status(200).send({
		message: "Appointment booked successfully",
		success: true,
	  });
	} catch (error) {
	  console.log(error);
	  res.status(500).send({
		message: "Error booking appointment",
		success: false,
		error,
	  });
	}
  });

  
  //Get appointments by user id 
  router.get("/get-appointments-by-user-id", isUser, async (req, res) => {
	try {
	  const appointments = await Appointment.find({ userId: req.auth.user._id }).sort({date: -1});
	  res.status(200).send({
		message: "Appointments fetched successfully",
		success: true,
		data: appointments,
	  });
	} catch (error) {
	  console.log(error);
	  res.status(500).send({
		message: "Error fetching appointments",
		success: false,
		error,
	  });
	}
  });

  //check appointments
router.get(
	"/get-appointments-by-doctor-id",
	isAdmin,
	async (req, res) => {
	  try {
		const doctor = await User.findOne({ _id: req.auth.user._id });
		const appointments = await Appointment.find({ doctorId: doctor._id });
		res.status(200).send({
		  message: "Appointments fetched successfully",
		  success: true,
		  data: appointments,
		});
	  } catch (error) {
		console.log(error);
		res.status(500).send({
		  message: "Error fetching appointments",
		  success: false,
		  error,
		});
	  }
	}
  );
  
  //change appointment status
  router.post("/change-appointment-status", isAdmin, async (req, res) => {
	try {
	  const { appointmentId, status } = req.body;
	  const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
		status,
	  });
  
	  res.status(200).send({
		message: "Appointment status updated successfully",
		success: true
	  });
	} catch (error) {
	  console.log(error);
	  res.status(500).send({
		message: "Error changing appointment status",
		success: false,
		error,
	  });
	}
  });
  




  

module.exports = router;
