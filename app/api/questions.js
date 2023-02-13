import client from "./client";

const endpoint = "/questions";

const getMeQuestions = () => client.get(endpoint);

export default {
  getMeQuestions,
};
