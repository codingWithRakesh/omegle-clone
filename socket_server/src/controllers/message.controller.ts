import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Request, Response, NextFunction } from "express";
import { getUserDetails, removeUserDetails, isUserExist } from "../cache/userDetails.js";
import { io } from "../socket/socket.js";

interface MessageRequest {
    receiverId: string;
    message: string;
}

const sendMessageController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { receiverId, message }: MessageRequest = req.body;

    if (!receiverId || !message) {
        throw new ApiError(400, "receiverId and message are required");
    }
    console.log({ receiverId, message });

    io.to(receiverId).emit("new_message", { receiverId, message });
    console.log(`Emitted new_message to receiverId: ${receiverId}`);

    res.status(200).json(new ApiResponse(200, null, "Message sent successfully"));
});


export {
    sendMessageController
}