import transporter from "../Frameworks/Services/MailService";
const sentMail = async (
  email: string,
  emailSubject: string,
  content: string
) => {
  try {
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