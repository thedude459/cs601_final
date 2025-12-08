import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample data for drag and drop
interface Capital {
  id: number;
  capital: string;
  state: string;
}

const capitalsData: Capital[] = [
  { id: 1, capital: 'Augusta', state: 'Maine' },
  { id: 2, capital: 'Concord', state: 'New Hampshire' },
  { id: 3, capital: 'Montpelier', state: 'Vermont' },
  { id: 4, capital: 'Boston', state: 'Massachusetts' },
  { id: 5, capital: 'Providence', state: 'Rhode Island' },
  { id: 6, capital: 'Hartford', state: 'Connecticut' },
];

// Routes

// Get capitals for drag and drop game
app.get('/api/capitals', (_req: Request, res: Response) => {
  res.json(capitalsData);
});

// Get weather data based on coordinates
app.get('/api/weather', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // Using Open-Meteo API - completely free, no API key needed, no rate limits
    console.log(`Fetching weather for lat: ${lat}, lon: ${lon}`);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_10m,wind_direction_10m,weather_code,cloud_cover,uv_index&daily=sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=1`
    );

    if (!response.ok) {
      console.error('Open-Meteo API error:', response.status, response.statusText);
      throw new Error('Failed to fetch weather data');
    }

    const data: any = await response.json();
    console.log('Weather data received:', data);

    // Map weather codes to descriptions
    const weatherDescriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    const weatherCode = data.current.weather_code;
    const description = weatherDescriptions[weatherCode] || 'Unknown';

    // Get icon code based on weather
    let icon = '01d'; // default sunny
    if (weatherCode === 0 || weatherCode === 1) icon = '01d';
    else if (weatherCode === 2) icon = '02d';
    else if (weatherCode === 3) icon = '03d';
    else if (weatherCode === 45 || weatherCode === 48) icon = '50d';
    else if (weatherCode >= 51 && weatherCode <= 55) icon = '09d';
    else if (weatherCode >= 61 && weatherCode <= 65) icon = '10d';
    else if (weatherCode >= 71 && weatherCode <= 77) icon = '13d';
    else if (weatherCode >= 80 && weatherCode <= 82) icon = '09d';
    else if (weatherCode >= 85 && weatherCode <= 86) icon = '13d';
    else if (weatherCode >= 95) icon = '11d';

    // Use geocoding API to get city name
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'CS601-final/1.0',
        },
      }
    );
    const geocodeData: any = await geocodeResponse.json();
    console.log('Geocode data received:', geocodeData);

    const city =
      geocodeData.address?.city ||
      geocodeData.address?.town ||
      geocodeData.address?.village ||
      geocodeData.address?.county ||
      'Unknown location';

    const result = {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      description: description,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation || 0,
      precipitationProbability: data.current.precipitation_probability || 0,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      cloudCover: data.current.cloud_cover,
      uvIndex: data.current.uv_index,
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
      city: city,
      icon: icon,
    };

    console.log('Sending weather response:', result);
    res.json(result);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get tech news from Hacker News API
app.get('/api/news', async (_req: Request, res: Response) => {
  try {
    // Fetch top stories from Hacker News
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const storyIds = (await response.json()) as number[];

    // Fetch first 12 stories
    const storyPromises = storyIds.slice(0, 12).map(async (id: number) => {
      const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyResponse.json();
    });

    const stories = await Promise.all(storyPromises);

    // Transform to article format
    const articles = stories
      .filter((story: any) => story && story.title)
      .map((story: any) => ({
        title: story.title,
        description: `${story.score || 0} points by ${story.by || 'unknown'} | ${story.descendants || 0} comments`,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        publishedAt: new Date(story.time * 1000).toISOString(),
        source: {
          name: 'Hacker News',
        },
      }));

    res.json(articles);
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({
      error: 'Failed to fetch news',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get Boston sports scores from ESPN API
app.get('/api/sports', async (_req: Request, res: Response) => {
  try {
    const teams = [
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

    // Helper function to extract game data from event
    const extractGameData = (event: any, team: any) => {
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

    // Fetch data for all teams
    const gamePromises = teams.map(async (team) => {
      try {
        // Fetch last 7 days of games (includes today and recent past)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}${month}${day}`;
        };

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

    const results = await Promise.all(gamePromises);
    res.json(results);
  } catch (error) {
    console.error('Sports API error:', error);
    res.status(500).json({
      error: 'Failed to fetch sports data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Export the Express app as a serverless function
export default app;
