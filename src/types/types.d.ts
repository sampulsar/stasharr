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
  genres: string[];
  tags: string[];
  added: string;
  ratings: Record<string, any>;
  credits: any[];
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
