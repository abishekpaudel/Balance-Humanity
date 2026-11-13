jest.mock("nodemailer", () => ({
    createTransport: jest.fn(),
}));

const nodemailer = require("nodemailer");
const sendingMail = require("../../server/helpers/sending_mail");

describe("Mail helper", () => {
    let transporter;

    beforeEach(() => {
        transporter = {
            sendMail: jest.fn().mockResolvedValue(undefined),
        };
        nodemailer.createTransport.mockReturnValue(transporter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("sends an OTP email and returns the OTP result", async () => {
        const message = {
            email: "person@example.com",
            subject: "Verify your account",
            details: {message: "Your verification code is", value: "123456"},
            type: "OTP",
        };

        await expect(sendingMail.send(message)).resolves.toEqual({
            status: true,
            OTP: "123456",
        });
        expect(transporter.sendMail).toHaveBeenCalledWith({
            to: message.email,
            subject: message.subject,
            text: "Your verification code is 123456 ",
        });
    });

    it("returns an unsuccessful result for non-OTP mail", async () => {
        await expect(
            sendingMail.send({
                email: "person@example.com",
                subject: "Notification",
                details: {message: "A notice", value: "details"},
                type: "NOTICE",
            })
        ).resolves.toEqual({status: false, value: "UnsuccessFul"});
    });
});
