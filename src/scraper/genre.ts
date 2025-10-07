import { load } from "cheerio";
import { headersConfig } from "../utils/config.js";
import { Genre, IError } from "../types/interfaces.js";

export const getGenres = async (): Promise<Genre[] | IError> => {
  try {
    const res = await fetch("https://nekopoi.care/genre-list/", {
      method: "GET",
      headers: headersConfig.headers,
    });

    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

    const html = await res.text();
    const $ = load(html);

    const genres: Genre[] = [];

    $(".genres ul li a").each((_i, el) => {
      const name = $(el).text().trim();
      const url = $(el).attr("href") ?? "";
      if (name && url) {
        genres.push({ name, url });
      }
    });

    return genres;
  } catch (err) {
    console.error(err);
    return {
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
