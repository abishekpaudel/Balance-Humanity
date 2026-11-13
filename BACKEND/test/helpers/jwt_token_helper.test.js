process.env.ACCESS_TOKEN_SECRET_KEY = "test-access-secret";
process.env.TOKEN_SECRET = "test-auth-secret";
process.env.AUTH_HASH_ALGORITHM = "HS256";
process.env.AUTH_TOKEN_EXPIRES = "1h";

const jwt = require("jsonwebtoken");
const jwtTokenHelper = require("../../server/helpers/jwt_token_helper");

describe("JWT token helper", () => {
    it("generates and verifies an access token for a user", async () => {
        const userId = "customer-123";
        const result = jwtTokenHelper.generateJWTAccessToken(userId);

        expect(result).toMatchObject({success: true, userInfo: userId});
        await expect(
            jwtTokenHelper.verifyJWTToken(
                result.token,
                process.env.ACCESS_TOKEN_SECRET_KEY
            )
        ).resolves.toMatchObject({
            success: true,
            data: {user: userId},
        });
    });

    it("generates a refresh token with the configured user payload", async () => {
        const userId = "customer-456";
        const result = jwtTokenHelper.generateJWTRefreshToken(userId);
        const decoded = jwt.decode(result.token);

        expect(result).toMatchObject({success: true, userInfo: userId});
        expect(decoded).toMatchObject({user: userId});
        expect(decoded.exp - decoded.iat).toBe(10 * 24 * 60 * 60);
    });

    it("generates an auth token using the auth secret", async () => {
        const result = jwtTokenHelper.generateJwtAuthToken({role: "admin"});

        await expect(
            jwtTokenHelper.verifyJWTToken(result.token, process.env.TOKEN_SECRET)
        ).resolves.toMatchObject({
            success: true,
            data: {role: "admin"},
        });
    });

    it("reports invalid tokens as a failed verification", async () => {
        await expect(
            jwtTokenHelper.verifyJWTToken("invalid-token", "test-access-secret")
        ).rejects.toEqual({success: false, message: "JsonWebTokenError"});
    });

    it("rejects a token signed with a different secret", async () => {
        const token = jwt.sign(
            {user: "customer-789"},
            "another-secret",
            {algorithm: "HS256"}
        );

        await expect(
            jwtTokenHelper.verifyJWTToken(token, "test-access-secret")
        ).rejects.toEqual({success: false, message: "JsonWebTokenError"});
    });

    it("rejects an expired token", async () => {
        const token = jwt.sign(
            {user: "customer-789", exp: Math.floor(Date.now() / 1000) - 1},
            "test-access-secret",
            {algorithm: "HS256"}
        );

        await expect(
            jwtTokenHelper.verifyJWTToken(token, "test-access-secret")
        ).rejects.toEqual({success: false, message: "TokenExpiredError"});
    });
});
