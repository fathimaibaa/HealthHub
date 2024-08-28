import nodemailer from "nodemailer";
import configKeys from "../../Config";

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:configKeys.APP_EMAIL,
        pass:configKeys.APP_PASSWORD,
    },
});

export default transporter;