import { config } from 'dotenv';
import transporter from '@/config/nodemailer';
config({path: '.env'})

const contactUs = async (name: string, email: string, subject: string, message: string)=>{
    const template = `
        <div style="background-color: #182a46; padding: 20px; border-radius: 10px; border: none;">
            <div style="margin-bottom: 10px;">
                <h1 style="text-align: center; font-weight: bold; color: #89e0d1;">Email from Portfolio</h1>
            </div>
            <div style="margin-bottom: 10px;">
                <h2 style="color: #c2cded; font-weight: bold;">Message: </h2>
                <div style="border-radius: 10px; padding: 10px; background-color: white;">
                    <p style="font-size: 15px; color: black; white-space: pre-wrap;">${message}</p>
                </div>
            </div>
            <div>
                <p style="font-size: 15px; margin: 0; color: #c2cded;">from ${name},<br>${email}</p>
            </div>
        </div>
    `

    // send mail with defined transport object

    await transporter.sendMail({
        from: { address: email, name }, // sender address
        to: process.env.DESTINATION_EMAIL, // list of receivers
        subject: `${subject}`, // Subject line
        html: template  // html body
    });
}

export default contactUs;