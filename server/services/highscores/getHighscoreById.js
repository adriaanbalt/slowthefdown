const HighScoresDataSource = require('./HighScoresDataSource');

module.exports = function*(HighScoresId) {
  const HighScores = HighScoresDataSource.getById(HighScoresId);

  if (!HighScores) {
    throw console.error(`Invalid HighScores ID: ${HighScoresId}`);
  }

  return HighScores;
}