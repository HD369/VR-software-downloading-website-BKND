const express = require('express');
const router = express.Router();
const cors = require('cors')
const { test, Registeruser, Loginuser, getprofile,googlelogin, Paymonthdetail, Payyeardetail,
        Paymonthgetdata, Payyeargetdata, mPayintegration, yPayintegration, monthNotification} = require('./ControlHD')


//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000',
        methods: "GET,POST,PUT,DELETE"
    })
)

router.get('/', test)
router.post('/Signup', Registeruser)
router.post('/Login', Loginuser)
router.get('/Profile', getprofile)
router.post('/googlelogin', googlelogin)
router.post('/month-details', Paymonthdetail); 
router.post('/year-details', Payyeardetail);
router.get("/Getpaymonth", Paymonthgetdata); // for showing payment history in the dashboard
router.get("/Getpayyear", Payyeargetdata); //for showing yearly payment history in the dashboard
router.post("/month/create-checkout-session", mPayintegration); //For stripe payment montly
router.post("/year/create-checkout-session", yPayintegration); // For Stripe payment Yearly



module.exports = router