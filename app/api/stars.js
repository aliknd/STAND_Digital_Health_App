import client from "./client";
const updateTimesPlayed = (userId) => client.post("/timesplayedupdate", { id: userId });

// const updateStars = (userId, starsToAdd) => client.post("/starupdate", { id: userId, stars: starsToAdd });

export default { updateTimesPlayed };
