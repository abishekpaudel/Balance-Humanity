const minioHelper = require("../../server/helpers/minio_helper");

describe("MinIO image type helpers", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("detects JPEG and PNG data signatures", () => {
        expect(minioHelper.detectMimeType("/9j/4AAQ")).toBe("image/jpeg");
        expect(minioHelper.detectMimeType("iVBORw0KGgoAAA")).toBe("image/png");
    });

    it("returns no MIME type for an unknown base64 signature", () => {
        expect(minioHelper.detectMimeType("not-an-image")).toBeUndefined();
    });

    it("accepts PNG, JPEG, and JPG signatures with matching extensions", () => {
        expect(minioHelper.checkMimeType("89504e47", "image/png")).toEqual({
            invalid: false,
        });
        expect(minioHelper.checkMimeType("ffd8ffe0", "image/jpeg")).toEqual({
            invalid: false,
        });
        expect(minioHelper.checkMimeType("ffd8ffe1", "image/jpg")).toEqual({
            invalid: false,
        });
    });

    it("rejects mismatched and unsupported image signatures", () => {
        expect(minioHelper.checkMimeType("89504e47", "image/jpeg")).toEqual({
            invalid: true,
            message: "Only jpeg/jpg and png formats are allowed.",
        });
        expect(minioHelper.checkMimeType("00000000", "image/png")).toEqual({
            invalid: true,
            message: "Only jpeg/jpg and png formats are allowed.",
        });
    });
});
