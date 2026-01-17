import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Request, Response, NextFunction } from "express";
import { User } from "../cache/userDetails.js";
import { io } from "../socket/socket.js";

const machingLogicController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId1, userId2, roomId }: { userId1: string; userId2: string; roomId: string } = req.body;

    console.log({ userId1, userId2, roomId });

    const response = await fetch(`${process.env.SERVER_URL}/logic/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId1, userId2, roomId })
    })
    const { roomList } = await response.json();
    console.log("Received roomList from logic server:", roomList);

    if (roomList && roomList.length > 0) {
        for (const room of roomList) {
            if (room.userId1) {
                io.to(room.userId1).emit("match_found", { roomId: room.roomId, peer: room.userId2 });
                console.log("Emitted match_found to userId1");
            }   
            if (room.userId2) {
                io.to(room.userId2).emit("match_found", { roomId: room.roomId, peer: room.userId1 });
                console.log("Emitted match_found to userId2");
            }
        }
    }

    res.status(200).json(new ApiResponse(200, { roomList }, "Matching logic processed successfully"));

});


export { machingLogicController };