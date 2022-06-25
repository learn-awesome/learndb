export const io_fetchUrl = (url, asyncReturn) => {
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      asyncReturn(data.thumbnail_url, data.html);
    });
};

export const io_fetchVideoThumbnailUrl = (youtubeurl, asyncReturn) => {
  if (!youtubeurl) asyncReturn(null);
  const url = `https://www.youtube.com/oembed?url=${youtubeurl}&format=json`;

  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      asyncReturn(data.thumbnail_url);
    });
};
