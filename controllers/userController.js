// Imports the User model from the '../models' module
const { User, Thought } = require("../models");

const userController = {
  // Method to get all users from the database
  async getUsers(req, res) {
    try {
      const userData = await User.find({});
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  },
  // Method to add a new user to the database
  async addUser({ body }, res) {
    try {
      const userData = await User.create(body);
      res.json(userData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Method to get a user by ID from the database
  async getUserByID({ params }, res) {
    try {
      const userData = await User.findOne({ _id: params.id });
      res.json(userData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Method to update a user by ID in the database
  async updateUser({ params, body }, res) {
    try {
      const userData = await User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true });
      if (!userData) {
        res.status(400).json({ message: "No user found with this ID!" });
        return;
      }
      res.json(userData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Method to delete a user by ID from the database
  async deleteUser({ params }, res) {
    try {
      const userData = await User.findById(params.id);
      if (!userData) {
        res.status(400).json({ message: "No user found with this ID!" });
        return;
      }

      await Thought.deleteMany({ _id: { $in: userData.thoughts.map((t) => t.id) } });
      await userData.delete();
      res.json({ message: "User has been deleted" });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Method to add a friend to a user's friends array by user ID
  async addFriend({ params }, res) {
    try {
      const userData = await User.findOneAndUpdate({ _id: params.id }, { $push: { friends: params.friendId } }, { runValidators: true, new: true });
      if (!userData) {
        res.status(400).json({ message: "No user found with this ID!" });
        return;
      }
      res.json(userData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Method to delete a friend from a user's friends array by user ID and friend ID
  async deleteFriend({ params }, res) {
    try {
      const userData = await User.findOneAndUpdate({ _id: params.id }, { $pull: { friends: params.friendId } }, { runValidators: true, new: true });
      if (!userData) {
        res.status(404).json({ message: "No user found with this ID!" });
        return;
      }
      res.json(userData);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};

// Exports the userController object
module.exports = userController;
