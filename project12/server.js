const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upodedfiles");
  },
  filename: (req, file, cb) => {
    console.log(file);

    cb(null, `${file.originalname}_${Date.now()}`);
  },
});

const upload = multer({ storage: storage });

let userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]{2,30}$/;
      },
      message: (props) => `${props.value} is not a valid firstname`,
    },
    required: [true, "firstname is Mandatory"],
  },
  lastName: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]{2,30}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid lastname`,
    },
    required: [true, "lastname is Mandatory"],
  },
  age: {
    type: Number,
    min: [18, "your age is below 18 years"],
    max: [120, "invalid age"],
    required: [true, "Age is Mandatory"],
  },
  gender: {
    type: String,
    validate: {
      validator: function (v) {
        // Convert the input to lowercase for case-insensitive comparison
        const lowerCaseValue = v.toLowerCase();
        // List of acceptable gender options in lowercase
        const genderOptions = [
          "male",
          "female",
          "non-binary",
          "others",
          "prefer not to say",
        ];
        return genderOptions.includes(lowerCaseValue);
      },
      message: (props) => `${props.value} is not a valid gender`,
    },
    required: [true, "Gender is Mandatory"],
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: [true, "email is Mandatory"],
  },
  password: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid password!`,
    },
    required: [true, "password is Mandatory"],
  },
  mobileNo: {
    type: Number,
    validate: {
      validator: function (v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
    required: [true, "User mobile number required"],
  },
  profilePic: String,
});
let User = new mongoose.model("users", userSchema);

app.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  // app.post("/signup", upload.array("profilePic"), async (req, res) => {
  // console.log(req.files)                    (for multiple files)

  try {
    let signedupDetails = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      gender: req.body.gender,
      email: req.body.email,
      password: req.body.password,
      mobileNo: req.body.mobileNo,
      profilePic: req.file.path,
      // profilePic: req.files[0].path,          (for multiple fises)
    });

    await User.insertMany([signedupDetails]);
    res.json({ status: "Success", msg: "User created Successfully" });
  } catch (error) {
    res.json({
      status: "failure",
      msg: "Unable to creat account.",
      error: error,
    });
  }
});

app.listen(13189, () => {
  console.log("Listening to port 13189");
});

let connectToMDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://govardhank:govardhank@brnstudent.z5qymfc.mongodb.net/BRNinfotech?retryWrites=true&w=majority&appName=brnstudent"
    );
    console.log("Successfully connected to MDB");
  } catch (error) {
    console.log("Unable to connect MDB");
    console.log(error);
  }
};
connectToMDB();
