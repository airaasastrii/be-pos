import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import pool from "../config/db.js";
import prisma from "../config/prisma.js";

const USERS = [
    {
        name: "Aira",
        email: "admin@gmail.com",
        password: "12345678",
    },
];


export const login = async (req,res) => {
    const {email, password} = req.body;

    // if(!email || !password){
    //     // 400: bad response (browser)
    //     // 500: server error (server/database)
    //     // 200: success (success)
    //     res.status(400).json({
    //         status: false,
    //         message: "Email atau password required"

    // });

    // }

    // kenapa pakai await? untuk minta ke query
    // find()
    // password boleh di munculin boleh engga, better jangan.
    // const user = USERS.find((u) => u.email === email && u.password === password)
    // email punya sifat unik

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if(!user){
            return res.status(401).json({
            status: false,
            message: "Invalid crendential",
        });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            // 401 : unauthorize = login gagal 
            return res.status(401).json({
                status: false,
                message: "Invalid crendential",
            });
        }

        // jangan di masukin password nya
        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            }, 
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || "1d"},
        ); 

        res.status(200).json({
            status: true,
            message: "Login Success",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                token,
            }
        });

    } catch (error) {
        res.status(500).json({status: false, message: "Internal server error", error: error.message})
    }
    

    // const [user] = await pool.query("SELECT id, name, email, password FROM users WHERE email= ?", [email]);
    // if (user.length === 0) {
    //     return res.status(401).json({
    //         status: false,
    //         message: "Invalid crendential",
    //     });
    // }

    // const dataUser = user[0];
    // const isMatch = await bcrypt.compare(password, dataUser.password);
    // if(!isMatch){
    //     // 401 : unauthorize = login gagal 
    //     return res.status(401).json({
    //         status: false,
    //         message: "Invalid crendential",
    //     });
    // }

    // // jangan di masukin password nya
    // const token = jwt.sign({
    //     id: dataUser.id,
    //     name: dataUser.name,
    //     email: dataUser.email,
    //     }, 
    //     process.env.JWT_SECRET,
    //     {expiresIn: process.env.JWT_EXPIRES_IN || "1d"},
    // ); 

    // res.status(200).json({
    //     status: true,
    //     message: "Login Success",
    //     data: {
    //         user: {
    //             id: dataUser.id,
    //             name: dataUser.name,
    //             email: dataUser.email,
    //         },
    //         token,
    //     }
    // });
};

export const me = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                creater_at: true,
            }
        });
        return res.status(200).json({
            status: true,
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

