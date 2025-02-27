export interface Continent {
  name: string;
}

export interface Country {
  code: string;
  name: string;
  continent: Continent;
  currency: string;
  emoji: string;
}

export interface CountriesData {
  countries: Country[];
}

export interface CountriesVars {
  limit: number;
  offset: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
