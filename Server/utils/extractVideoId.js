export const extractVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1);
    }

    return parsedUrl.searchParams.get("v");
  } catch (error) {
    return null;
  }
};