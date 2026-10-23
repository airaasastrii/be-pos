import pool from "../config/db.js";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
const USERS = [
    {
        id: 1,
        name: "Aira",
        email: "aira@gmail.com",
        password: "12345678",
    },
      {
        id: 2,
        name: "Ratna",
        email: "ratna@gmail.com",
        password: "12345678",
    },
      {
        id: 3,
        name: "Laras",
        email: "laras@gmail.com",
        password: "12345678",
    },
];

//  CRUD ( Create, Read, Update, Delete )

// read
export const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select:{
        id: true,
        name: true,
        email: true,
        created_at: true,
        update_at: true,
      },
      orderBy: { id: "desc" }
    });
    // const [rows] = await pool.query(
    //   "SELECT id, name, email, is_active FROM users",
    // );
    return res.status(200).json({
      status: true,
      message: "Fetch user success",
      total: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Fail fetch user",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    // find = mencari id atau code lain
    // const [user] = await pool.query(
    //   "SELECT id, name, is_active FROM users WHERE id= ?",
    //   [id],
    // );
    //   res.status(404).json({
    //     status: false,
    //     message: "User not found",
    //   });
    // }

    res.status(200).json({
      status: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Fail fetch user",
      error: error.message,
    });
  }
};
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  // const name = req.body.name;
  // const password = req.body.password;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
      select: {
        id: true,
        name: true, 
        email: true,
      },
    });
    // const [user] = await pool.query(
    //   "INSERT INTO users(name,email,password) VALUES (?,?,?)",
    //   [name, email, password],
    // );

    return res.status(201).json({
      status: true,
      message: "Create user success",
      data: { id: user.insertId, name, email },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Create user failed",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;
    let update = "";

    const dataUpdate = {}
    if(email) dataUpdate.email = email
    if(name) dataUpdate.name = name
    if(password){
      dataUpdate.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: dataUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    // if (!password) {
    //   const [user] = await pool.query(
    //     "UPDATE users SET name=?, email=?, password=? WHERE id=?",
    //     [name, email, id],
    //   );
    // } else {
    //   const [user] = await pool.query(
    //     "UPDATE users SET name=?, email=?, password=? WHERE id=?",
    //     [name, email, password, id],
    //   );
    // }
    return res.status(200).json({
      status: true,
      message: "Update user success",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }

  // name yg pertama biru itu punya users, kalo name yg di dalem itu dari payload (data yg di input di depan). PILOT cuma bisa di POST.
  // user mana dari index yang mau di ambil, user artinya data yg muncul.
  // find = mencari data atau id
};

export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // const [user] = await pool.query("DELETE FROM users WHERE id=?", [id]);
    await prisma.user.delete({
      where: { id: id },
    });

      res.status(200).json({
        status: true,
        message: "Delete user success",
      });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


//     const deletedUser = USERS.splice(userIndex, 1)[0];
//      return res.status(200).json({
//             status: true,
//             message: "Delete user success",
//      });



