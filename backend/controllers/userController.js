import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Grid from "../models/gridModel.js";

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
const logoutUser = expressAsyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

const getGrid = expressAsyncHandler(async (req, res) => {
  let grid = await Grid.findOne();

  if (!grid) {
    grid = new Grid({
      grid: Array(10).fill(Array(10).fill(null)),
    });
    await grid.save();
  }

  res.json(grid);
});

const updateGrid = expressAsyncHandler(async (req, res, next) => {
  const { rowIndex, colIndex, unicodeChar } = req.body;
  const userId = req.user._id;

  const grid = await Grid.findOne();

  if (grid) {
    const userHasUpdated = grid.grid.some((row) =>
      row.some(
        (cell) =>
          cell !== null &&
          cell.userId &&
          cell.userId.toString() === userId.toString()
      )
    );

    if (userHasUpdated) {
      res
        .status(403)
        .json({
          message: "You have already updated a cell and cannot update another.",
        });
      return;
    }

    if (
      !grid.grid[rowIndex][colIndex] ||
      grid.grid[rowIndex][colIndex] === null
    ) {
      grid.grid[rowIndex][colIndex] = { value: unicodeChar, userId };
    } else {
      const cell = grid.grid[rowIndex][colIndex];

      if (cell.userId) {
        res.status(400);
        throw new Error("This cell has already been updated by another user");
      }

      cell.value = unicodeChar;
      cell.userId = userId;
    }

    grid.markModified("grid");
    await grid.save();

    req.app.get("io").emit("gridUpdated", { rowIndex, colIndex, unicodeChar });

    res.json({ message: "Grid updated successfully" });
  } else {
    res.status(404);
    throw new Error("Grid not found");
  }
});

export { authUser, registerUser, logoutUser, getGrid, updateGrid };
