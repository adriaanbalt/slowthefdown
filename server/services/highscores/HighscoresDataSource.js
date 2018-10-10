
class HighscoresDataSource {
  constructor() {
    this.highscores = require('../../config/highscores.json');
  }

  getById(id) {
    return this.highscores.find(highscore => highscore.id === id);
  }
}

module.exports = new HighscoresDataSource();
