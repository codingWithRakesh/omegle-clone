import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Request, Response, NextFunction } from "express";
import { getUserDetails } from "../cache/userDetails.js";
import { io } from "../socket/socket.js";

export interface MatchRequest {
    userId1: string;
    userId2: string;
    roomId: string;
}

const machingLogicController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId1 }: MatchRequest = req.body;

    console.log({ userId1 });

    const response = await fetch(`${process.env.SERVER_URL}/logic/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId1 })
    })
    const { roomList } : { roomList: MatchRequest[] } = await response.json();
    console.log("Received roomList from logic server:", roomList);

    if (roomList && roomList.length > 0) {
        for (const room of roomList) {
            if (room.userId1) {
                io.to(room.userId1).emit("match_found", { roomId: room.roomId, peer: getUserDetails(room.userId2) });
                console.log("Emitted match_found to userId1");
            }   
            if (room.userId2) {
                io.to(room.userId2).emit("match_found", { roomId: room.roomId, peer: getUserDetails(room.userId1) });
                console.log("Emitted match_found to userId2");
            }
        }
    }

    res.status(200).json(new ApiResponse(200, { roomList }, "Matching logic processed successfully"));

});

const endVideoCallController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { roomId, userId }: { roomId: string; userId: string } = req.body;
    if (!roomId || !userId) {
        throw new ApiError(400, "roomId and userId are required");
    }

    io.to(userId).emit("call_ended", { roomId, userId });
    console.log(`Emitted call_ended to roomId: ${roomId} by userId: ${userId}`);

    res.status(200).json(new ApiResponse(200, { roomId, userId }, "Video call ended successfully"));
});


export { machingLogicController, endVideoCallController  };