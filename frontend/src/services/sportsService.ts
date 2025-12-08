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

interface Team {
  name: string;
  sport: string;
  league: string;
  logo: string;
  searchTerms: string[];
}

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

const extractGameData = (event: any, team: Team): Game => {
  const competition = event.competitions[0];
  const homeTeam = competition.competitors.find((c: any) => c.homeAway === 'home');
  const awayTeam = competition.competitors.find((c: any) => c.homeAway === 'away');

  const isBostonHome = team.searchTerms.some((term: string) =>
    homeTeam?.team?.displayName?.toLowerCase().includes(term.toLowerCase())
  );

  const bostonTeam = isBostonHome ? homeTeam : awayTeam;
  const opponent = isBostonHome ? awayTeam : homeTeam;

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

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const getSportsScores = async (): Promise<Game[]> => {
  const gamePromises = teams.map(async (team) => {
    try {
      // Fetch last 7 days of games (includes today and recent past)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const endDate = formatDate(new Date());
      const startDate = formatDate(sevenDaysAgo);

      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/${team.sport}/${team.league}/scoreboard?dates=${startDate}-${endDate}`
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const data: any = await response.json();
      const bostonEvents = data.events?.filter((event: any) =>
        event.competitions?.[0]?.competitors?.some((comp: any) =>
          team.searchTerms.some((term) =>
            comp.team?.displayName?.toLowerCase().includes(term.toLowerCase())
          )
        )
      );

      if (bostonEvents && bostonEvents.length > 0) {
        // Get the most recent game
        const mostRecentEvent = bostonEvents.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        return extractGameData(mostRecentEvent, team);
      }

      // No game found in last 7 days
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

  return Promise.all(gamePromises);
};
