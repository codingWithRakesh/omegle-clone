import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { Request, Response, NextFunction } from "express"
import { User, getUserDetails, setUserDetails, updateUserDetails } from "../cache/userDetails.js"
import { userDetailsCache } from "../cache/userDetails.js"
import { MatchRequest } from "./logic.controller.js"
import { io } from "../socket/socket.js"

const setUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id, name, gender }: User = req.body;
    if (!id || !name || !gender) {
        return next(new ApiError(400, "Missing required user fields", [
            { field: "id", message: "User ID is required" },
            { field: "name", message: "User name is required" },
            { field: "gender", message: "User gender is required" }
        ]));
    }

    const userDetails: User = { id, name, gender };
    setUserDetails(id, userDetails);

    const response = await fetch(`${process.env.SERVER_URL}/logic/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId1: id })
    })
    const { roomList } : { roomList: Array<MatchRequest> } = await response.json();

    if (roomList && roomList.length > 0) {
        for (const room of roomList) {
            if (room.userId1) {
                io.to(room.userId1).emit("match_found", { roomId: room.roomId, peer: getUserDetails(room.userId2) });
            }   
            if (room.userId2) {
                io.to(room.userId2).emit("match_found", { roomId: room.roomId, peer: getUserDetails(room.userId1) });
            }
        }
    }

    res.status(200).json(new ApiResponse(200, { roomList }, "User details set successfully"));
})

const updateUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id, name, gender }: User = req.body;
    if (!id) {
        return next(new ApiError(400, "User ID is required to update details", [
            { field: "id", message: "User ID is required" }
        ]));
    }
    const existingUser : User | null = getUserDetails(id);
    if (!existingUser) {
        return next(new ApiError(404, "User not found", [
            { field: "id", message: "No user found with the provided ID" }
        ]));
    }
    const updatedUser: User = {
        id,
        name: name || existingUser.name,
        gender: gender || existingUser.gender
    };
    updateUserDetails(id, updatedUser);
    res.status(200).json(new ApiResponse(200, { id: id }, "User details updated successfully"));
});

const findUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params.id as string;
    if (!userId) {
        return next(new ApiError(400, "User ID is required to fetch details", [
            { field: "id", message: "User ID is required" }
        ]));
    }
    const user : User | null = getUserDetails(userId);
    if (!user) {
        return next(new ApiError(404, "User not found", [
            { field: "id", message: "No user found with the provided ID" }
        ]));
    }
    res.status(200).json(new ApiResponse(200, user, "User details fetched successfully"));
});

const mapIsEmptyController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const isEmpty: boolean = userDetailsCache.size === 0;
    res.status(200).json(
        new ApiResponse(200, { isEmpty }, "User details cache emptiness checked successfully")
    );

})

const allMapUsersController = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const allUsers: Array<User> = Array.from(userDetailsCache.values());
    res.status(200).json(
        new ApiResponse(200, { allUsers }, "All users in cache fetched successfully")
    );
});


export {
    setUserController, 
    updateUserController, 
    findUserController, 
    mapIsEmptyController, 
    allMapUsersController 
};