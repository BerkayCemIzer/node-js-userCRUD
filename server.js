const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

var cors = require("cors");
const User = require("./models/userModel");

app.use(cors({origin: 'https://nodecrudcem.onrender.com/'}));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.static(__dirname));

//rotalar

app.get("/", async function (req, res) {
  try {
    const users = await User.find({});
    res.sendFile(__dirname + "/" + "index.html");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users", async function (req, res) {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users/:name", async function (req, res) {
  try {
    const { name } = req.params;
    const user = await User.find({ name: { $regex: name, $options: "i" } });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/useredit/:id", async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/user", async (req, res) => {
  const data = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    age: req.body.age,
    address: {
      street: req.body.address.street,
      city: req.body.address.city,
      zipcode: req.body.address.zipcode,
      country: req.body.address.country,
    },
  };
  try {
    const arr = [];
    const findOneEmail = await User.findOne({ email: req.body.email });
    if (
      findOneEmail != undefined ||
      req.body.name == "" ||
      req.body.surname == "" ||
      req.body.email == "" ||
      req.body.address.street == "" ||
      req.body.address.city == "" ||
      req.body.address.zipcode == "" ||
      req.body.address.country == ""
    ) {
      if (findOneEmail) {
        // return res.json({message: "Email zaten kayıtlı."})
        arr.push({
          emailAlready:
            "Girdiğiniz e-mail adresi kayıtlı. Başka bir e-mail giriniz.",
        });
      }
      if (req.body.name == "") {
        arr.push({ name: "Lütfen isim giriniz." });
      }
      if (req.body.surname == "") {
        arr.push({ surname: "Lütfen soyisim giriniz." });
      }
      if (req.body.email == "") {
        arr.push({ email: "Lütfen email giriniz." });
      }
      if (
        req.body.email.match(
          /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
        )
      ) {
        arr.push({ emailValid: "Lütfen geçerli bir mail adresi giriniz." });
      }
      if (req.body.age == "") {
        arr.push({ age: "Lütfen yaşınızı giriniz." });
      }
      if (req.body.address.street == "") {
        arr.push({ street: "Lütfen sokak giriniz." });
      }
      if (req.body.address.city == "") {
        arr.push({ city: "Lütfen şehir giriniz." });
      }
      if (req.body.address.zipcode == "") {
        arr.push({ zipcode: "Lütfen posta kodu giriniz." });
      }
      if (req.body.address.country == "") {
        arr.push({ country: "Lütfen ülke giriniz." });
      }
      return res.json(arr);
    }
    await User.insertMany([data]);
    //res.status(200).json(User);
    res.json({ success: true, message: "Form verileri başarıyla kaydedildi." });
  } catch (error) {
    console.log(error.message);
    // res.status(500).json({success: false, message: error.message})
    res.status(500).json({ message: error.message });
  }
});

app.put("/userput/:id", async (req, res) => {
  const data = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    age: req.body.age,
    address: {
      street: req.body.address.street,
      city: req.body.address.city,
      zipcode: req.body.address.zipcode,
      country: req.body.address.country,
    },
  };

  const { id } = req.params;
  console.log(data);
  try {
    const arr = [];
    const findOneEmail = await User.findOne({_id: {$ne: req.params.id}, "email": req.body.email});

    if (
      findOneEmail != undefined ||
      req.body.name == "" ||
      req.body.surname == "" ||
      req.body.email == "" ||
      req.body.address.street == "" ||
      req.body.address.city == "" ||
      req.body.address.zipcode == "" ||
      req.body.address.country == ""
    ) {
      if (findOneEmail) {
        // return res.json({message: "Email zaten kayıtlı."})
        arr.push({
          emailAlready:
            "Girdiğiniz e-mail adresi kayıtlı. Başka bir e-mail giriniz.",
        });
      }
      if (req.body.name == "") {
        arr.push({ name: "Lütfen isim giriniz." });
      }
      if (req.body.surname == "") {
        arr.push({ surname: "Lütfen soyisim giriniz." });
      }
      if (req.body.email == "") {
        arr.push({ email: "Lütfen email giriniz." });
      }
      if (
        req.body.email.match(
          /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i
        )
      ) {
        arr.push({ emailValid: "Lütfen geçerli bir mail adresi giriniz." });
      }
      if (req.body.age == "") {
        arr.push({ age: "Lütfen yaşınızı giriniz." });
      }
      if (req.body.address.street == "") {
        arr.push({ street: "Lütfen sokak giriniz." });
      }
      if (req.body.address.city == "") {
        arr.push({ city: "Lütfen şehir giriniz." });
      }
      if (req.body.address.zipcode == "") {
        arr.push({ zipcode: "Lütfen posta kodu giriniz." });
      }
      if (req.body.address.country == "") {
        arr.push({ country: "Lütfen ülke giriniz." });
      }
      return res.json(arr);
    }


    const user = await User.findByIdAndUpdate(id, data, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User was not found." });
    }
    res.json({ success: true, message: "Form verileri başarıyla kaydedildi." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Node is running port: 3000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
