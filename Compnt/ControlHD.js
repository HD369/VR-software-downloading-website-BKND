const User = require('../models/User');
const GoogleUser = require('../models/gUser');
const Paym = require('../models/Paym');
const Payy = require('../models/Payy');
const { hashPassword, comparePassword } = require('../helpers/Auth')
const jwt = require('jsonwebtoken');

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const dotenv = require('dotenv').config();



const test = (req, res) => (
    res.json('Databasse is working Successfully..!')
)

//Registration bknd .........................................................................................
const Registeruser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        //Check is right or not
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        };
        //check password
        if (!password || password.length < 5) {
            return res.json({
                error: 'password must be 5 character...!'
            })
        };
        //check email
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: 'Email is alredy exists..!'
            })
        };


        //check phone
        const exist2 = await User.findOne({ phone });
        if (exist2) {
            return res.json({
                error: 'Phone number is alredy exists..!'
            })
        }
        //create user in database
        const hashedPassword = await hashPassword(password)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}


//Login bknd .........................................................................................
const Loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check email
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: 'User not found...!'
            })
        }
        //check if password match
        const match = await comparePassword(password, user.password)
        if (match) {
            // res.json('password match..!')
            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user)
            })
        }
        if (!match) {
            res.json({
                error: 'not match password'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

//User profile ...................................................................................................................
const getprofile = (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user)
        })
    }
    else {
        res.json(null)
    }
}



//Google User login ...................................................................................................................
const googlelogin = (req, res) => {
    const { email_verified, email, name, clientId, userName } = req.body
    console.log(req.body)
    if (email_verified) {
        GoogleUser.findOne({ email: email })
            .then((savedUser) => {
                if (savedUser) {
                    const token = jwt.sign({ _id: savedUser.id }, process.env.JWT_SECRET)
                    const { _id, name, email, userName } = savedUser
                    res.json({ token, user: { _id, name, email, userName } })
                    console.log({ token, user: { _id, name, email, userName } })
                }
                else {
                    const password = email + clientId
                    const user = GoogleUser.create({
                        name,
                        email,
                        password: password,
                        userName
                    })
                        .then(user => {
                            let userId = user._id.toString()
                            const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET)
                            const { _id, name, email, userName } = user
                            res.json({ token, user: { _id, name, email, userName } })
                            console.log({ token, user: { _id, name, email, userName } })
                        })
                        .catch(err => { console.log(err) })
                    res.json(user)
                }
            })
    }
}



//# Monthly Stripe Payment data Managment ..................................................................................

//POST Month data from Mongodb ________________________________________________________
const Paymonthdetail = async (req, res) => {
    try {
        const { pname, pemail, pnumber, panumber, pcity, pstate, pcountry } = req.body;

        //check Aadharcard number
        if (!panumber || panumber.length < 12) {
            return res.json({
                error: 'Aadhar number must be 12 digit...!'
            })
        };
        //create user in database
        const user = await Paym.create({
            pname,
            pemail,
            pnumber,
            panumber,
            pcity,
            pstate,
            pcountry
        })
        return res.json(user),
            console.log(user)
    } catch (error) {
        console.log(error)
    }
}

//GET Month data from Mongodb ________________________________________________________
const Paymonthgetdata = async (req, res) => {
        try {
            const userm = await Paym.find();
            res.json(userm);
            // console.log(userm)
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
          }

}

//Make-Payment POST Month data validation ________________________________________________________
const mPayintegration = async (req, res) => {
    const { productm } = req.body;
    const session = await stripe.checkout.sessions.create({

        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: productm.name,
                    },
                    unit_amount: productm.price * 100,
                },
                quantity: productm.quantity,
            },
        ],
        phone_number_collection: {
            enabled: true,
        },
        mode: "payment",
        success_url: "http://localhost:3000/SAJDJKJDFHKJBCA_KAVALajksdkj12313_skdjlakdj_nsdkaslskdjlak_aldskjcbshd_vadvandc64byw_g8736vsahdvq9f",
        cancel_url: "http://localhost:3000/Cancel",
    });
    res.json({ id: session.id });

    const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );
    console.log(lineItems);
};




//# Year Stripe Payment data Managment .............................................................................

//POST Year data from Mongodb ________________________________________________________
const Payyeardetail = async (req, res) => {
    try {
        const { yname, yemail, ynumber, yanumber, ycity, ystate, ycountry } = req.body;

        console.log(yname, yemail, ynumber, yanumber, ycity, ystate, ycountry)

        //check Aadharcard number
        if (!yanumber || yanumber.length < 12) {
            return res.json({
                error: 'Aadhar number must be 12 digit...!'
            })
        };

        //create user in database
        const user = await Payy.create({
            yname,
            yemail,
            ynumber,
            yanumber,
            ycity,
            ystate,
            ycountry
        })
        return res.json(user),
            console.log(user)
    } catch (error) {
        console.log(error)
    }
}

//GET Year data from Mongodb ________________________________________________________
const Payyeargetdata = async (req, res) => {
    try {
        const usery = await Payy.find();
        res.json(usery);
        // console.log(usery)
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
      }
}

//Make-Payment POST Year data validation ________________________________________________________
const yPayintegration = async (req, res) => {
    const { producty } = req.body;
    const session = await stripe.checkout.sessions.create({

        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: producty.name,
                    },
                    unit_amount: producty.price * 100,
                },
                quantity: producty.quantity,
            },
        ],
        phone_number_collection: {
            enabled: true,
        },
        mode: "payment",
        success_url: "http://localhost:3000/SAJDJKJDFHKJBCA_KAVALajksdkj12313_skdjlakdj_nsdkaslskdjlak_aldskjcbshd_vadvandc64byw_g8736vsahdvq9f",
        cancel_url: "http://localhost:3000/Cancel",
    });
    res.json({ id: session.id });

    const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );
    console.log(lineItems);
};



module.exports = {
    test,
    Registeruser,
    Loginuser,
    getprofile,
    googlelogin,
    Paymonthdetail,
    Payyeardetail,
    Paymonthgetdata,
    Payyeargetdata,
    mPayintegration,
    yPayintegration
}