// shareOnTwitter.js

export const shareOnTwitter = (url, text, hashtags = [], imageUrl = '') => {
    const twitterBaseUrl = 'https://twitter.com/intent/tweet';
    const params = new URLSearchParams({
      url,
      text: `${text} ${imageUrl}`,
      hashtags: hashtags.join(','),
    });
    window.open(`${twitterBaseUrl}?${params.toString()}`, '_blank');
  };
  