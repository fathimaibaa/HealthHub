"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatController_1 = __importDefault(require("../../../Adapters/ChatController"));
const ChatDbRepository_1 = __importDefault(require("../../../App/Interfaces/ChatDbRepository"));
const ChatRepositoryMongodb_1 = require("../../Database/Repositories/ChatRepositoryMongodb");
const chatRoute = () => {
    const router = (0, express_1.Router)();
    const _chatController = (0, ChatController_1.default)(ChatDbRepository_1.default, ChatRepositoryMongodb_1.chatRepositoryMongodb);
    router.post("/conversations", _chatController.createNewChat);
    router.get("/conversations/:senderId", _chatController.fetchChats);
    router.post("/messages", _chatController.createNewMessage);
    router.get("/messages/:conversationId", _chatController.fetchMessages);
    return router;
};
exports.default = chatRoute;
