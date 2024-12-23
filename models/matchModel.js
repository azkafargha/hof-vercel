const pool = require("../db/connection");


const saveMatch = async (user1Id, user2Id, winner) => {
  const result = await pool.query(
    "INSERT INTO matches (user1_id, user2_id, winner) VALUES ($1, $2, $3) RETURNING *",
    [user1Id, user2Id, winner]
  );
  return result.rows[0];
};

const updateUserPoints = async (userId, points) => {
  try {
    // Query untuk memperbarui poin user atau menambahnya jika belum ada
    await pool.query(
      `
        INSERT INTO leaderboard (user_id, points)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET points = leaderboard.points + $2
      `,
      [userId, points]
    );

    console.log("Points successfully updated.");
  } catch (error) {
    console.error("Error updating user points:", error);
  }
};


const getLeaderboard = async () => {
  const result = await pool.query(
    `
    SELECT u.full_name, l.points 
    FROM leaderboard l
    JOIN users u ON l.user_id = u.id
    WHERE u.full_name != 'Computer'
    ORDER BY l.points DESC, u.full_name ASC
    `
  );
  return result.rows;
};

module.exports = { saveMatch, updateUserPoints, getLeaderboard };
