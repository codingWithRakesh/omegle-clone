import { ApiError } from "../utils/apiError.js";

export interface User {
    id: string;
    name: string;
    gender: string;
}

export const userDetailsCache: Map<string, User> = new Map();

const getUserDetails = (userId: string): User | null => {
    return userDetailsCache.get(userId) || null;
};

const setUserDetails = (userId: string, userDetails: User): void => {
    // if(userDetailsCache.has(userId)) {
    //     throw new ApiError(400, "User details already exist for this ID", [
    //         { field: "id", message: "User ID already exists" }
    //     ]);
    // }
    userDetailsCache.set(userId, userDetails);
};

const updateUserDetails = (userId: string, userDetails: User): void => {
    if (!userDetailsCache.has(userId)) {
        throw new ApiError(404, "User not found for this ID", [
            { field: "id", message: "No user found with the provided ID" }
        ]);
    }
    userDetailsCache.set(userId, userDetails);
};

const removeUserDetails = (userId: string): void => {
    if (!userDetailsCache.has(userId)) {
        throw new ApiError(404, "User not found for this ID", [
            { field: "id", message: "No user found with the provided ID" }
        ]);
    }

    userDetailsCache.delete(userId);
};

const removeUserDetailsSafe = (userId: string): boolean => {
  return userDetailsCache.delete(userId);
};

const isUserExist = (userId: string): boolean => {
    return userDetailsCache.has(userId);
};

export {
    getUserDetails,
    setUserDetails,
    removeUserDetails,
    updateUserDetails,
    isUserExist,
    removeUserDetailsSafe
};