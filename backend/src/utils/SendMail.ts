import transporter from "../frameworks/services/MailService";
const sentMail = async (
  email: string,
  emailSubject: string,
  content: string
) => {
  try {
    console.log('inside the send mailer')
    const info = await transporter.sendMail({
      from: '"HEALTH HUB" <HealthHub@gmail.com>',
      to: email,
      subject: emailSubject,
      html: content,
    });

    console.log(`Email sent to ${email} : `, info.messageId);
  } catch (error) {
    console.log("Error in sending mail:", error);
  }
};
export default sentMail;