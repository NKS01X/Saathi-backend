import bcrypt from "bcryptjs"
const salt = 69;
export const encrypt = async (pass) => {
    return await bcrypt.hash(pass,salt);
}

export const verifyPass = async (pass,hash) => {
    return await bcrypt.compare(pass,hash);
}