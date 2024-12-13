import config from './dbConfig.js';
import sql from 'mssql';

// Fetch all coaches
const getCoach = async () => {
  try {
    let pool = await sql.connect(config);
    let coaches = await pool.request().query('SELECT * FROM Coach');
    return coaches.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch all coach nationalities
const getCoachNationalities = async () => {
  try {
    let pool = await sql.connect(config);
    let nationalities = await pool.request().query('SELECT * FROM CoachNationalities');
    return nationalities.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch all leagues
const getLeague = async () => {
  try {
    let pool = await sql.connect(config);
    let leagues = await pool.request().query('SELECT * FROM League');
    return leagues.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch all matches
const getMatch = async () => {
  try {
    let pool = await sql.connect(config);
    let matches = await pool.request().query('SELECT * FROM Match');
    return matches.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch all nationalities
const getNationality = async () => {
  try {
    let pool = await sql.connect(config);
    let nationalities = await pool.request().query('SELECT * FROM Nationality');
    return nationalities.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch all players
const getPlayer = async () => {
  try {
    let pool = await sql.connect(config);
    let players = await pool.request().query('SELECT * FROM Player');
    return players.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch player ratings
const getPlayerRatings = async () => {
  try {
    let pool = await sql.connect(config);
    let ratings = await pool.request().query('SELECT * FROM PlayerRatings');
    return ratings.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch all positions
const getPosition = async () => {
  try {
    let pool = await sql.connect(config);
    let positions = await pool.request().query('SELECT * FROM Position');
    return positions.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch all teams
const getTeam = async () => {
  try {
    let pool = await sql.connect(config);
    let teams = await pool.request().query('SELECT * FROM Team');
    return teams.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch all team match stats
const getTeamMatchStats = async () => {
  try {
    let pool = await sql.connect(config);
    let stats = await pool.request().query('SELECT * FROM TeamMatchStats');
    return stats.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Fetch all season standings
const getSeasonStandings = async () => {
  try {
    let pool = await sql.connect(config);
    let standings = await pool.request().query('SELECT * FROM SeasonStandings');
    return standings.recordset;
  } catch (error) {
    console.error(error);
  }
};

// Export all functions
export default {
  getCoach,
  getCoachNationalities,
  getLeague,
  getMatch,
  getNationality,
  getPlayer,
  getPlayerRatings,
  getPosition,
  getTeam,
  getTeamMatchStats,
  getSeasonStandings,
};
