import client from "./client";

const register = (userInfo) => client.post("/users", userInfo);

const updateScore = (userId, scoreToAdd) => client.post("/scoreupdate", { id: userId, score: scoreToAdd });

const updateStars = (userId, starsToAdd) => client.post("/starupdate", { id: userId, stars: starsToAdd });

export default { register, updateScore, updateStars };
