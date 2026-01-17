import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { Request, Response, NextFunction } from "express"
import { User, getUserDetails, setUserDetails, updateUserDetails } from "../cache/userDetails.js"

const setUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

    res.status(200).json(new ApiResponse(200, { id: id }, "User details set successfully"));
})

const updateUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

const findUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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


export { setUserController, updateUserController, findUserController };