/**
 * Sports Service
 *
 * This service integrates with the ESPN public API to fetch recent game scores
 * for Boston sports teams (Bruins, Red Sox, Patriots, Celtics).
 *
 * The service fetches games from the last 7 days and returns the most recent
 * game for each team with scores, opponent information, and game status.
 */

// Interface representing a single game result
export interface Game {
  team: string;
  opponent: string;
  teamScore: number;
  opponentScore: number;
  date: string;
  status: string;
  logo: string;
  sport: string;
}

// Internal interface for team configuration
interface Team {
  name: string; // Display name (e.g., "Bruins")
  sport: string; // Sport type for ESPN API (e.g., "hockey")
  league: string; // League abbreviation (e.g., "nhl")
  logo: string; // Emoji icon for display
  searchTerms: string[]; // Terms to match team names in ESPN data
}

// Configuration for all Boston sports teams being tracked
const teams: Team[] = [
  {
    name: 'Bruins',
    sport: 'hockey',
    league: 'nhl',
    logo: '🏒',
    searchTerms: ['boston bruins', 'bruins'],
  },
  {
    name: 'Red Sox',
    sport: 'baseball',
    league: 'mlb',
    logo: '⚾',
    searchTerms: ['boston red sox', 'red sox'],
  },
  {
    name: 'Patriots',
    sport: 'football',
    league: 'nfl',
    logo: '🏈',
    searchTerms: ['new england patriots', 'patriots'],
  },
  {
    name: 'Celtics',
    sport: 'basketball',
    league: 'nba',
    logo: '🏀',
    searchTerms: ['boston celtics', 'celtics'],
  },
];

/**
 * Extracts and formats game data from ESPN API event response
 *
 * @param event - Raw event data from ESPN API
 * @param team - Team configuration object
 * @returns Formatted Game object with scores and details
 */
const extractGameData = (event: any, team: Team): Game => {
  // Get the competition data (ESPN can have multiple competitions per event)
  const competition = event.competitions[0];

  // Find home and away teams from competitors array
  const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
  const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');

  // Determine if Boston team is home or away
  const isBostonHome = team.searchTerms.some((term: string) =>
    homeTeam?.team?.displayName?.toLowerCase().includes(term.toLowerCase())
  );

  // Assign Boston team and opponent based on home/away status
  const bostonTeam = isBostonHome ? homeTeam : awayTeam;
  const opponent = isBostonHome ? awayTeam : homeTeam;

  // Return formatted game data
  return {
    team: team.name,
    opponent: opponent?.team?.shortDisplayName || opponent?.team?.displayName || 'TBD',
    teamScore: parseInt(bostonTeam?.score || '0'),
    opponentScore: parseInt(opponent?.score || '0'),
    date: event.date || new Date().toISOString(),
    status: event.status?.type?.description || 'Scheduled',
    logo: team.logo,
    sport: team.sport,
  };
};

/**
 * Formats a Date object into ESPN API date format (YYYYMMDD)
 *
 * @param date - Date to format
 * @returns Formatted date string (e.g., "20251208")
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Fetches recent game scores for all Boston sports teams
 *
 * This function:
 * 1. Queries ESPN API for each team's games from the last 7 days
 * 2. Filters results to find games featuring the Boston team
 * 3. Returns the most recent game for each team
 * 4. Handles errors gracefully by returning placeholder data
 *
 * @returns Promise resolving to array of Game objects (one per team)
 */
export const getSportsScores = async (): Promise<Game[]> => {
  // Create array of promises, one for each team
  const gamePromises = teams.map(async (team) => {
    try {
      // Calculate date range: last 7 days including today
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const endDate = formatDate(new Date());
      const startDate = formatDate(sevenDaysAgo);

      // Fetch scoreboard data from ESPN API
      // URL format: /sports/{sport}/{league}/scoreboard?dates={start}-{end}
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/${team.sport}/${team.league}/scoreboard?dates=${startDate}-${endDate}`
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data: any = await response.json();

      // Filter events to find games involving Boston team
      // ESPN data includes all games, so we search for team name matches
      const bostonEvents = data.events?.filter((event: any) =>
        event.competitions?.[0]?.competitors?.some((comp: any) =>
          team.searchTerms.some((term) =>
            comp.team?.displayName?.toLowerCase().includes(term.toLowerCase())
          )
        )
      );

      if (bostonEvents && bostonEvents.length > 0) {
        // Sort by date to get the most recent game
        const mostRecentEvent = bostonEvents.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        return extractGameData(mostRecentEvent, team);
      }

      // No game found in the last 7 days - return placeholder
      return {
        team: team.name,
        opponent: 'No recent game',
        teamScore: 0,
        opponentScore: 0,
        date: new Date().toISOString(),
        status: 'No games in last 7 days',
        logo: team.logo,
        sport: team.sport,
      };
    } catch (err) {
      // Handle errors gracefully - return placeholder data
      console.error(`Error fetching ${team.name}:`, err);
      return {
        team: team.name,
        opponent: 'Data unavailable',
        teamScore: 0,
        opponentScore: 0,
        date: new Date().toISOString(),
        status: 'Error loading',
        logo: team.logo,
        sport: team.sport,
      };
    }
  });

  // Wait for all team requests to complete and return results
  return Promise.all(gamePromises);
};
