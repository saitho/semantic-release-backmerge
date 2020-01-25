import {Message} from "../src/Message";

describe("Message", () => {
    it("prints Hello World'", () => {
        const message = new Message();
        expect(message.getMessage()).toStrictEqual('Hello world!');
        expect(message.getAuthor()).toStrictEqual('saitho');
    });
});