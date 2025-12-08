export interface Article {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export const getNews = async (): Promise<Article[]> => {
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

  return articles;
};
