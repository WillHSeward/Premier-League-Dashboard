import './App.css';
import React, { useState, useEffect, useMemo } from 'react';

function App() {
  //Variables to store data from different tables
  const [data, setData] = useState([]);
  const [lookup, setLookup] = useState({
    coaches: {},
    nationalities: {},
    leagues: {},
    teams: {},     
    positions: {},
    coachNationalities: {},
    ratings: {},
  });
  const [error, setError] = useState(null);
  const [activeTable, setActiveTable] = useState('');

  //Field Defenitions to exclude for each table to clean up the displayed data
  const excludedFields = {
    Coaches: ['CoachID', 'TeamID'],
    Players: ['PlayerID'],
    Leagues: ['Name'],
    Matches: ['MatchID', 'LeagueID'], 
    Teams: ['TeamID', 'LeagueID'],
    TeamMatchStats: ['TeamMatchID'],
    SeasonStandings: ['PositionID', 'StandingsID', 'LeagueID'], 
  };

  //Column name overrides for better readability
  const columnNameOverrides = {
    FirstName: 'First Name',
    LastName: 'Last Name',
    CoachID: 'Coach Name',
    NationalityID: 'Nationality',
    HomeTeamID: 'Home Team',
    AwayTeamID: 'Away Team',
    MatchDate: 'Match Date',
    StartDate: 'Start Date',
    EndDate: 'End Date',
    Rating: 'Player Rating',
    PositionID: 'Position',
    TeamName: 'Team Name',
    Result: 'W / L',
    PKatt: 'Attempted Penalties',
    PK: 'Scored Penalties',
    FK: 'Free Kicks',
    SoT: 'Shots On Target',
    Sh: 'Shots',
    Poss: 'Possession',
    xGA: 'Expected Goals Against',
    xG: 'Expected Goals For',
    StandingsID: 'Standings',
    TeamID: 'Teams', 
    LeagueID: 'League',
  };

  //Fetch initial data required for mapping when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        //Fetch all necessary data concurrently
        const [
          coachesResponse,
          nationalitiesResponse,
          leaguesResponse,
          teamsResponse,
          positionsResponse,
          coachNationalitiesResponse,
          ratingsResponse,
        ] = await Promise.all([
          fetch('/api/coaches'),
          fetch('/api/nationalities'),
          fetch('/api/leagues'),
          fetch('/api/teams'),
          fetch('/api/positions'),
          fetch('/api/coach-nationalities'),
          fetch('/api/player-ratings'),
        ]);

        //Checks to see if all responses are successful
        if (
          !coachesResponse.ok ||
          !nationalitiesResponse.ok ||
          !leaguesResponse.ok ||
          !teamsResponse.ok ||
          !positionsResponse.ok ||
          !coachNationalitiesResponse.ok ||
          !ratingsResponse.ok
        ) {
          throw new Error('Error fetching initial data');
        }

        //Parse JSON data from responses
        const coachesData = await coachesResponse.json();
        const nationalitiesData = await nationalitiesResponse.json();
        const leaguesData = await leaguesResponse.json();
        const teamsData = await teamsResponse.json();
        const positionsData = await positionsResponse.json();
        const coachNationalitiesData = await coachNationalitiesResponse.json();
        const ratingsData = await ratingsResponse.json();

        //Create lookup maps for constant-time access
        const coachesMap = coachesData.reduce((acc, coach) => {
          acc[coach.CoachID] = coach;
          return acc;
        }, {});

        const nationalitiesMap = nationalitiesData.reduce((acc, nat) => {
          acc[nat.NationalityID] = nat.CountryName;
          return acc;
        }, {});

        const leaguesMap = leaguesData.reduce((acc, league) => {
          acc[league.LeagueID] = league.Name;
          return acc;
        }, {});

        const teamsMap = teamsData.reduce((acc, team) => {
          acc[team.TeamID] = team.Name;
          return acc;
        }, {});

        const positionsMap = positionsData.reduce((acc, pos) => {
          acc[pos.PositionID] = pos.PositionName;
          return acc;
        }, {});

        const coachNationalitiesMap = coachNationalitiesData.reduce((acc, cn) => {
          acc[cn.CoachID] = cn.NationalityID;
          return acc;
        }, {});

        const ratingsMap = ratingsData.reduce((acc, rating) => {
          acc[rating.PlayerID] = rating.Rating;
          return acc;
        }, {});

        //Update the lookup state with all mapping data
        setLookup({
          coaches: coachesMap,
          nationalities: nationalitiesMap,
          leagues: leaguesMap,
          teams: teamsMap,
          positions: positionsMap,
          coachNationalities: coachNationalitiesMap,
          ratings: ratingsMap,
        });
      } catch (err) {
        console.error('Error fetching initial data:', err.message);
        setError(err.message);
      }
    };
    fetchInitialData();
  }, []);

  const fetchData = async (url, tableName) => {
    try {
      setError(null);
      setActiveTable(tableName);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err.message);
      setError(err.message);
      setData([]);
    }
  };

  //Utility function to format date strings to YYYY-MM-DD.
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  
  //Consolidated function to map and transform data based on the active table.
  const mapData = (data) => {
    switch (activeTable) {
      case 'Matches':
        return data.map(item => ({
          ...item,
          HomeTeamID: lookup.teams[item.HomeTeamID] || `Unknown Team (${item.HomeTeamID})`,
          AwayTeamID: lookup.teams[item.AwayTeamID] || `Unknown Team (${item.AwayTeamID})`,
          MatchDate: item.MatchDate ? formatDate(item.MatchDate) : item.MatchDate,
        }));

      case 'Players':
        return data.map(item => ({
          ...item,
          TeamID: lookup.teams[item.TeamID] || `Unknown Team (${item.TeamID})`,
          PositionID: lookup.positions[item.PositionID] || `Unknown Position (${item.PositionID})`,
          NationalityID: lookup.nationalities[item.NationalityID] || `Unknown Nationality (${item.NationalityID})`,
          Rating: lookup.ratings[item.PlayerID] || 'N/A',
        }));

      case 'Coaches':
        return data.map(item => {
          const natID = lookup.coachNationalities[item.CoachID];
          const nationality = natID ? (lookup.nationalities[natID] || `Unknown Nationality (${natID})`) : 'N/A';
          return {
            ...item,
            Nationality: nationality,
            StartDate: item.StartDate ? formatDate(item.StartDate) : item.StartDate,
            EndDate: item.EndDate ? formatDate(item.EndDate) : item.EndDate,
          };
        });

      case 'Team Match Stats':
        //Aggregate statistics for each team
        const teamStats = {};
        data.forEach(item => {
          const teamName = lookup.teams[item.TeamID] || `Unknown Team (${item.TeamID})`;
          if (!teamStats[teamName]) {
            teamStats[teamName] = {
              TeamName: teamName,
              AttemptedPenalties: 0,
              ScoredPenalties: 0,
              FreeKicks: 0,
              ShotsOnTarget: 0,
              Shots: 0,
              Possession: 0,
              ExpectedGoalsAgainst: 0,
              ExpectedGoalsFor: 0,
              Wins: 0,
              Losses: 0,
              count: 0,
            };
          }

          //Accumulate statistics
          teamStats[teamName].AttemptedPenalties += parseFloat(item.PKatt) || 0;
          teamStats[teamName].ScoredPenalties += parseFloat(item.PK) || 0;
          teamStats[teamName].FreeKicks += parseFloat(item.FK) || 0;
          teamStats[teamName].ShotsOnTarget += parseFloat(item.SoT) || 0;
          teamStats[teamName].Shots += parseFloat(item.Sh) || 0;
          teamStats[teamName].Possession += parseFloat(item.Poss) || 0;
          teamStats[teamName].ExpectedGoalsAgainst += parseFloat(item.xGA) || 0;
          teamStats[teamName].ExpectedGoalsFor += parseFloat(item.xG) || 0;

          //Count wins and losses
          const result = item.Result ? item.Result.toLowerCase() : '';
          if (result === 'win' || result === 'w') {
            teamStats[teamName].Wins += 1;
          } else if (result === 'loss' || result === 'l') {
            teamStats[teamName].Losses += 1;
          }

          teamStats[teamName].count += 1;
        });

        //Calculate averages and format data for display
        return Object.values(teamStats).map(team => ({
          TeamName: team.TeamName,
          AttemptedPenalties: team.AttemptedPenalties,
          ScoredPenalties: team.ScoredPenalties,
          FreeKicks: team.FreeKicks,
          ShotsOnTarget: (team.ShotsOnTarget / team.count).toFixed(2),
          Shots: (team.Shots / team.count).toFixed(2),
          Possession: `${(team.Possession / team.count).toFixed(2)}%`,
          ExpectedGoalsAgainst: (team.ExpectedGoalsAgainst / team.count).toFixed(2),
          ExpectedGoalsFor: (team.ExpectedGoalsFor / team.count).toFixed(2),
          'W/L': `${team.Wins} / ${team.Losses}`,
        }));

      case 'Season Standings':
        return data.map(item => ({
          ...item,
          TeamID: lookup.teams[item.TeamID] || `Unknown Team (${item.TeamID})`,
        }));

      case 'Leagues':
      case 'Teams':
      default:
        return mapLeagueNames(data);
    }
  };


  //?
  const mapLeagueNames = (data) => {
    return data.map(item => ({
      ...item,
      LeagueID: lookup.leagues[item.LeagueID] || `Unknown League (${item.LeagueID})`,
    }));
  };


  //Process and filter data based on the active table
  //Uses useMemo to optimize performance by memoizing the result
  const processedData = useMemo(() => {
    if (!activeTable || data.length === 0) return [];
    const mapped = mapData(data);
    const fieldsToExclude = excludedFields[activeTable] || [];

    //Remove unwanted fields from the data
    return mapped.map(item => {
      const filteredItem = { ...item };
      fieldsToExclude.forEach(field => delete filteredItem[field]);
      return filteredItem;
    });
  }, [data, activeTable, lookup]);

  const getColumnHeader = (key) => columnNameOverrides[key] || key;

  return (
    <div className="App">
      <h1>Premier League Data Dashboard</h1>

      {/* Buttons to get different tables */}
      <div className="buttons">
        <button onClick={() => fetchData('/api/coaches', 'Coaches')}>Coaches</button>
        <button onClick={() => fetchData('/api/leagues', 'Leagues')}>Leagues</button>
        <button onClick={() => fetchData('/api/matches', 'Matches')}>Matches</button>
        <button onClick={() => fetchData('/api/players', 'Players')}>Players</button>
        <button onClick={() => fetchData('/api/teams', 'Teams')}>Teams</button>
        <button onClick={() => fetchData('/api/team-match-stats', 'Team Match Stats')}>
          Team Match Stats
        </button>
        <button onClick={() => fetchData('/api/season-standings', 'Season Standings')}>
          Season Standings
        </button>
      </div>

      {/* Display error message if any */}
      {error && <p className="error">Error: {error}</p>}

      {/* Display data in a table format */}
      <div className="data">
        <h2>{activeTable} Data</h2>
        {processedData.length > 0 ? (
          <table>
            <thead>
              <tr>
                {Object.keys(processedData[0]).map(key => (
                  <th key={key}>{getColumnHeader(key)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available. Click a button above to fetch data.</p>
        )}
      </div>
    </div>
  );
}

export default App;
