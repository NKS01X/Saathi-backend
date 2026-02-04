import bcrypt from "bcryptjs";

const saltRounds = 10; 

export const encrypt = async (pass) => {
    return await bcrypt.hash(pass, saltRounds);
};

export const verifyPass = async (pass, hash) => {
    return await bcrypt.compare(pass, hash);
};