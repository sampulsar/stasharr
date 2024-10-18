// types for the Whisparr API

type OriginalLanguage = {
  id: number;
  name: string;
};

type Image = {
  coverType: string;
  url: string;
  remoteUrl: string;
};

type Movie = {
  title: string;
  originalLanguage: OriginalLanguage;
  sortTitle: string;
  status: string;
  overview: string;
  releaseDate: string;
  images: Image[];
  year: number;
  studioTitle: string;
  studioForeignId: string;
  qualityProfileId: number;
  monitored: boolean;
  isAvailable: boolean;
  folderName: string;
  runtime: number;
  cleanTitle: string;
  tmdbId: number;
  foreignId: string;
  stashId: string;
  titleSlug: string;
  folder: string;
  genres: string[]; // Assuming genres are simple strings
  tags: string[]; // Assuming tags are simple strings
  added: string; // ISO date format
  ratings: Record<string, any>; // Assuming ratings are a key-value structure
  credits: any[]; // Assuming credits could be an array of objects
  itemType: string;
};

export type WhisparrScene = {
  foreignId: string;
  movie: Movie;
  id: number;
};

export type WhisparrMoviePayload = {
  title: string;
  studio: string;
  foreignId: string;
  monitored: boolean;
  rootFolderPath: string;
  addOptions: {
    searchForMovie: boolean;
  };
  qualityProfileId: number;
};
