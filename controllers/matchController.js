const {
  saveMatch,
  updateUserPoints,
  getLeaderboard,
} = require("../models/matchModel");

const recordMatch = async (req, res) => {
  let { user1Id, user2Id, rounds } = req.body;

  // Validasi jumlah ronde untuk Bo5
  if (rounds.length < 3 || rounds.length > 5) {
    return res.status(400).json({
      message: "Invalid number of rounds. Bo5 requires between 3 to 5 rounds.",
    });
  }

  try {
    let user1Wins = 0;
    let user2Wins = 0;
    let winner = null;

    if (user2Id === "computer") {
      user2Wins = 0; // Komputer tidak menang
      user1Wins = rounds.filter((round) => round.winner === "user1").length;

      if (user1Wins > 3) {
        winner = "user1";
      } else if (user1Wins < 3) {
        winner = "user2"; // Komputer menang
      } else {
        winner = "draw";
      }

      user2Id = null; // Set to null or omit this value to prevent issues with the leaderboard
    
      const match = await saveMatch(user1Id, user2Id, winner);
      console.log("Match saved:", match);

      // Update user points based on winner
      if (winner === "user1") {
        await updateUserPoints(user1Id, 3);
      } else if (winner === "user2" && user2Id !== "computer") {
        await updateUserPoints(user2Id, 3);
      } else if (winner === "draw") {
        await updateUserPoints(user1Id, 1);
        await updateUserPoints(user2Id, 1);
      }

      res.status(201).json({ message: "Match recorded successfully", match });
    } else {
      // Only update points without saving to leaderboard if opponent is 'computer'
      if (winner === "user1") {
        await updateUserPoints(user1Id, 3);
      } else if (winner === "draw") {
        await updateUserPoints(user1Id, 1);
      }

      res
        .status(201)
        .json({ message: "Match recorded successfully against computer" });
    }
  } catch (error) {
    console.error("Error details:", error); // Log error details
    res.status(500).json({ message: "Error recording match", error });
  }
};

const getLeaderboardData = async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error });
  }
};

module.exports = { recordMatch, getLeaderboardData };
