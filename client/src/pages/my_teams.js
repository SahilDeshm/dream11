import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/my_teams_css.css';
import axios from 'axios';
import PlayerSelection from '../components/player_selection';

const MyTeam = () => {
  const location = useLocation();
  const { selectedTeam } = location.state || {};
  const [activeTab, setActiveTab] = useState('team');
  const [leaderboardData, setLeaderboardData] = useState(null);
  const matchId = selectedTeam.matchId;
  const username = selectedTeam.username;
  const contestId = selectedTeam.contestId;
  const [isEditing, setIsEditing] = useState(false);
  const [isMatchComplete, setIsMatchComplete] = useState(false);
  const [matchState, setMatchState] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const fetchLeaderboardData = () => {
    const matchData = {
      matchId: selectedTeam.matchId,
      contestId: selectedTeam.contestId,
    };

    axios
      .get('http://localhost:3001/my_teams/leaderboard', { params: { matchData: matchData } })
      .then((response) => {
        setLeaderboardData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard data: ', error);
      });
  };

  useEffect(() => {
    const http = require('https');
    const options = {
      method: 'GET',
      hostname: 'cricbuzz-cricket.p.rapidapi.com',
      port: null,
      path: `/mcenter/v1/${matchId}/scard`,
      headers: {
        'X-RapidAPI-Key': '33692e1a65mshb5409f761d142bfp1fbc64jsn057b114ebff9',
        'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com',
      },
    };

    const req = http.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        const jsondata = JSON.parse(body.toString());
        setIsMatchComplete(jsondata.isMatchComplete);

        const match_header = jsondata.matchHeader;
        const matchState = match_header.state;
        setMatchState(matchState);
      });
    });

    req.end();
  }, [matchId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLeadClick = (tab) => {
    setActiveTab(tab);
    fetchLeaderboardData();
  };

  return (
    <div>
      <div className="tab-buttons">
        <button
          id="team-tab"
          className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => handleTabClick('team')}
        >
          Team
        </button>
        <button
          id="leaderboard-tab"
          className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => handleLeadClick('leaderboard')}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === 'team' && (
        <div>
          <h1 id="team-title" className="team-title">
            Selected Team
          </h1>
          {selectedTeam && (
            <div>
              <p className="team-info">
                {selectedTeam.team1Name} vs {selectedTeam.team2Name}
              </p>
              <p className="captain-info">Captain: {selectedTeam.captain}</p>
              <p className="vice-captain-info">Vice Captain: {selectedTeam.vice_captain}</p>
              <p className="players-title">Players:</p>
              <ul id="player-list" className="player-list">
                {selectedTeam.players.map((player, playerIndex) => (
                  <li key={playerIndex} className="player-info">
                    {player.name}
                  </li>
                ))}
              </ul>
              {isEditing ? (
                <PlayerSelection
                  id="player-selection"
                  matchId={matchId}
                  username={username}
                  contestId={contestId}
                  team1Name={selectedTeam.team1Name}
                  team2Name={selectedTeam.team2Name}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                />
              ) : (
                !isMatchComplete && matchState !== 'In Progress' ? (
                  <button id="edit-button" onClick={handleEditClick}>
                    Edit
                  </button>
                ):(<h4 className='edit_msg'>You cannot edit the team at this time.</h4>)
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="leaderboard">
          <h1 id="leaderboard-title" className="leaderboard-title">
            Leaderboard
          </h1>
          {leaderboardData ? (
            <ul id="leaderboard-list" className="leaderboard-list">
              {leaderboardData.map((entry, index) => (
                <li key={index} className="leaderboard-entry">
                  <span className="username">{entry.username}</span>
                  <span className="points">{entry.totalPoints} points</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="loading-message">Loading leaderboard data...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyTeam;
