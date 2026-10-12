import pool from "../config/db.js";
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
    const [rows] = await pool.query(
      "SELECT id, name, email,    is_active FROM users",
    );
    return res.status(200).json({
      status: true,
      message: "Fetch user success",
      total: rows.length,
      data: rows,
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
    // find = mencari id atau code lain
    const [user] = await pool.query(
      "SELECT id, name, is_active FROM users WHERE id= ?",
      [id],
    );
    if (!user[0]) {
      res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

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
    const [user] = await pool.query(
      "INSERT INTO users(name,email,password) VALUES (?,?,?)",
      [name, email, password],
    );

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

    if (!password) {
      const [user] = await pool.query(
        "UPDATE users SET name=?, email=?, password=? WHERE id=?",
        [name, email, id],
      );
    } else {
      const [user] = await pool.query(
        "UPDATE users SET name=?, email=?, password=? WHERE id=?",
        [name, email, password, id],
      );
    }
    return res.status(200).json({
      status: true,
      message: "Update user success",
      data: USERS,
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

    const [user] = await pool.query("DELETE FROM users WHERE id=?", [id]);

    if (!user) {
      res.status(404).json({
        status: false,
        message: "Delete fails",
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Delete is success",
      });
    }
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



