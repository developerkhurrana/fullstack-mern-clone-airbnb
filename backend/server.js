const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
    default: mongoose
} = require("mongoose");
const PORT = 4000;
const MDB_URI = process.env.MDB_URI;
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const bcryptjs = require("bcryptjs");
const cookeParser = require("cookie-parser");
const bcryptSalt = bcryptjs.genSaltSync(10);
const jwtSecret = "thisisajwtsecret";
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const {
    resolve
} = require("path");
const {
    rejects
} = require("assert");

app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookeParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));

mongoose.connect(MDB_URI).then(() => console.log("Pinged MongoDB, Successfully connected. ✅")).catch(err => {
    console.error("MongoDB connection failed ❌", err);
    process.exit(1);
});

// Test EP
app.get("/test", (req, res) => {
    res.json("Pinged Backend");
});

function getUserDataFromReq(req) {
    return new Promise((resolve, rejects) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err
            resolve(userData)
        })
    })
}

// Register EP
app.post("/register", async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcryptjs.hashSync(password, bcryptSalt)
        });
        res.json(userDoc);
    } catch (error) {
        res.status(422).json(error);
    }
});

// Login EP
app.post("/login", async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const userDoc = await User.findOne({
            email
        });
        if (!userDoc) {
            return res.status(404).json("Invalid User");
        }

        const isPasswordMatch = bcryptjs.compareSync(password, userDoc.password);

        if (!isPasswordMatch) {
            return res.status(422).json("Invalid Password");
        }
        jwt.sign({
            email: userDoc.email,
            id: userDoc._id,
            name: userDoc.name
        }, jwtSecret, {}, (err, token) => {
            if (err)
                throw err;
            return res.cookie("token", token).status(200).json(userDoc);
        });
    } catch (error) {
        console.log("Error during login", error);
        return res.status(500).json("Internal server error");
    }
});

// Profile EP
app.get("/profile", (req, res) => {
    const {
        token
    } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err)
                throw err;
            const {
                name,
                email,
                _id
            } = await User.findById(userData.id);
            res.json({
                name,
                email,
                _id
            });
        });
    } else {
        res.json(null);
    }
});

// Logout EP
app.post("/logout", (req, res) => {
    res.cookie("token", "").json(true);
});

// Post EP

app.post("/upload-by-link", async (req, res) => {
    const {
        link
    } = req.body;
    const newImageName = Date.now() + "placePhoto.jpg";
    const dest = __dirname + "/uploads/" + newImageName;

    await imageDownloader.image({
        url: link,
        dest: dest
    });
    res.json(newImageName);
});

// Photoupload EP
const photosMiddleware = multer({
    dest: "uploads/"
});
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {
            path,
            originalname
        } = req.files[i];
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = `${path}placePhoto.${ext}`;

        fs.renameSync(path, newPath);

        uploadedFiles.push(newPath.replace("uploads\\", ""));
    }
    res.json(uploadedFiles);
});

// Places Post EP
app.post("/places", (req, res) => {
    const {
        token
    } = req.cookies;
    const {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err)
            throw err;
        const placeDoc = await Place.create({
            owner: userData.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn: parseInt(checkIn),
            checkOut: parseInt(checkOut),
            maxGuests: parseInt(maxGuests),
            price: parseInt(price)
        });
        res.json(placeDoc);
    });
});

//Places Get EP
app.get("/user-places", (req, res) => {
    const {
        token
    } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {
            id
        } = userData;
        res.json(await Place.find({
            owner: id
        }));
    });
});

// Places by Id
app.get("/places/:id", async (req, res) => {
    const {
        id
    } = req.params;
    res.json(await Place.findById(id));
});

//Edit place
app.put("/places/", async (req, res) => {
    const {
        token
    } = req.cookies;
    const {
        id,
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title,
                address,
                photos: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn: parseInt(checkIn),
                checkOut: parseInt(checkOut),
                maxGuests: parseInt(maxGuests),
                price: parseInt(price)
            });
            await placeDoc.save();
            res.json("Updated");
        }
    });
});

// All Places
app.get("/places", async (req, res) => {
    res.json(await Place.find());
});

// Booking
app.post("/book-a-place", async (req, res) => {
    const userData = await getUserDataFromReq(req)
    const {
        place,
        checkIn,
        checkOut,
        guests,
        bookerName,
        bookerMobile,
        price
    } = req.body;
    Booking.create({
        place,
        user: userData.id,
        checkIn,
        checkOut,
        guests,
        bookerName,
        bookerMobile,
        price
    }).then((doc) => {
        res.json(doc)
    }).catch((err) => {
        throw err
    })
});



// Get all bookings
app.get('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req)
    res.json(
        await Booking.find({
            user: userData.id
        }).populate('place')
    )
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);

});
