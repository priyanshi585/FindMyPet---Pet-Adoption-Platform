
 const asyncHandler = require("express-async-handler")
 const otpGenerator = require("otp-generator");
 const User = require("../Model/userModel");
 const OTP = require("../Model/OTP");
 const mailSender = require("../mail/mailSender");
 const otpTemplate = require("../mail/emailVerificationTemplate");
const sendOtp = asyncHandler(async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);

		// Send OTP via email (non-blocking - don't let email errors prevent OTP save)
		try {
			await mailSender(email, "OTP Verification", otpTemplate(otp));
			console.log("OTP email sent successfully");
		} catch (emailError) {
			console.log("Warning: Failed to send OTP email, but OTP saved to DB:", emailError.message);
		}

		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
})

const verifyOtp = asyncHandler(async (req, res) => {
    // Find the most recent OTP for the email
    try {
    const {email,otpe} = req.body;
	console.log(email);
	console.log(otpe);
	
	
    if (!email  ) {
        return res.status(403).send({
            success: false,
            message: "Please Enter the email",
        });
    }
    if ( !otpe ) {
        return res.status(403).send({
            success: false,
            message: "Please Enter the otp",
        });
    }
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
                
                
			});
		} else if (otpe !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not  valid",
			});
		}
        res.status(200).json({
			success: true,
			message: `OTP Verified Successfully`,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}

})

 module.exports = {sendOtp,verifyOtp};