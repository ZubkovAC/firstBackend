import {dateUserJwtType} from "../types";
import * as jwt from "jsonwebtoken";

export const createJWT = async (dateUser:dateUserJwtType, expired:string) => {
    return  jwt.sign(dateUser,
        process.env.SECRET_KEY,
        {expiresIn: expired})
}