import client from "./client";

const register = (userInfo) => client.post("/users", userInfo);

const updateScore = (userId, scoreToAdd) => client.post(`/users/score`, { id: userId, score:scoreToAdd });
export default { register, updateScore };
