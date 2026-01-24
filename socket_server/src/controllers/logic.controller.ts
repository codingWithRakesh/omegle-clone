import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Request, Response, NextFunction } from "express";
import { getUserDetails, removeUserDetails, isUserExist } from "../cache/userDetails.js";
import { io } from "../socket/socket.js";

export interface MatchRequest {
    userId1: string;
    userId2: string;
    roomId: string;
}

const machingLogicController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId1 }: { userId1: string } = req.body;

    console.log({ userId1 });

    const response = await fetch(`${process.env.SERVER_URL}/logic/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId1 })
    })
    const { roomList }: { roomList: MatchRequest[] } = await response.json();
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
    const { roomId, peerId, userId, isEnd }: { roomId: string; peerId: string; userId: string; isEnd: boolean } = req.body;
    if (!userId) {
        throw new ApiError(400, "userId is required");
    }

    if(peerId && isUserExist(peerId)){
        console.log("Emitting call_ended to peerId:", peerId);
        io.to(peerId).emit("call_ended", { roomId, peerId, isExist: isUserExist(peerId) });
    }

    if(isEnd){
        removeUserDetails(userId);
    
        await fetch(`${process.env.SERVER_URL}/logic/remove`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId1: userId })
        })
    }

    console.log(`Emitted call_ended to roomId: ${roomId} by peerId: ${peerId}`);

    res.status(200).json(new ApiResponse(200, { roomId, peerId }, "Video call ended successfully"));
});


export { machingLogicController, endVideoCallController };