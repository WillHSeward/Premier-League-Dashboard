import express from 'express';
import dbOperation from './dbFiles/dbOperation.js';
import cors from 'cors';

const API_PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());

// Endpoint for Coach table
app.get('/api/coaches', async (req, res) => {
  try {
    const data = await dbOperation.getCoach();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for CoachNationalities table
app.get('/api/coach-nationalities', async (req, res) => {
  try {
    const data = await dbOperation.getCoachNationalities();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for League table
app.get('/api/leagues', async (req, res) => {
  try {
    const data = await dbOperation.getLeague();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Match table
app.get('/api/matches', async (req, res) => {
  try {
    const data = await dbOperation.getMatch();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Nationality table
app.get('/api/nationalities', async (req, res) => {
  try {
    const data = await dbOperation.getNationality();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Player table
app.get('/api/players', async (req, res) => {
  try {
    const data = await dbOperation.getPlayer();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for PlayerRatings table
app.get('/api/player-ratings', async (req, res) => {
  try {
    const data = await dbOperation.getPlayerRatings();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Position table
app.get('/api/positions', async (req, res) => {
  try {
    const data = await dbOperation.getPosition();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for Team table
app.get('/api/teams', async (req, res) => {
  try {
    const data = await dbOperation.getTeam();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for TeamMatchStats table
app.get('/api/team-match-stats', async (req, res) => {
  try {
    const data = await dbOperation.getTeamMatchStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for SeasonStandings table
app.get('/api/season-standings', async (req, res) => {
  try {
    const data = await dbOperation.getSeasonStandings();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
