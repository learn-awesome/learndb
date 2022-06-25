export const io_fetchUrl = (url, asyncReturn) => {
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      asyncReturn(data.thumbnail_url, data.html);
    });
};
