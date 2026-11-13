process.env.REDIS_HOST = "127.0.0.1";
process.env.REDIS_PORT = "6379";
process.env.REDIS_CACHE_EXPIRES = "5";

const mockValues = new Map();
const mockRedisClient = {
    on: jest.fn(),
    get: jest.fn((key, callback) => callback(null, mockValues.get(key) ?? null)),
    setex: jest.fn((key, expiry, value) => mockValues.set(key, value)),
};

jest.mock("redis", () => ({
    createClient: jest.fn(() => mockRedisClient),
}));

const redis = require("redis");
const redisHelper = require("../../server/helpers/redis_helper");

describe("Redis helper", () => {
    beforeEach(() => {
        mockValues.clear();
        jest.clearAllMocks();
    });

    it("initializes a Redis client with the configured host and port", () => {
        const log = jest.spyOn(console, "log").mockImplementation(() => {});

        redisHelper.init();

        expect(redis.createClient).toHaveBeenCalledWith({
            host: "127.0.0.1",
            port: "6379",
            no_ready_check: true,
            return_buffers: true,
        });
        expect(mockRedisClient.on).toHaveBeenCalledWith(
            "error",
            expect.any(Function)
        );
        log.mockRestore();
    });

    it("parses cached JSON objects and resolves cached strings", async () => {
        redisHelper.init();
        mockValues.set("customer:1", '{"name":"Alex"}');

        await expect(
            redisHelper.getCachedObjectData("customer:1")
        ).resolves.toEqual({
            status: 200,
            data: {name: "Alex"},
        });
        mockValues.set("token:1", "refresh-token");
        await expect(
            redisHelper.getCachedStringDataPromise("token:1")
        ).resolves.toEqual({status: 200, data: "refresh-token"});
    });

    it("rejects cache reads for missing values and serializes cached data", async () => {
        redisHelper.init();

        await expect(
            redisHelper.getCachedObjectData("missing")
        ).rejects.toEqual({status: 404, data: null});
        redisHelper.setDataForCatch("customer:2", {verified: true});
        expect(mockRedisClient.setex).toHaveBeenCalledWith(
            "customer:2",
            300,
            '{"verified":true}'
        );
    });
});
