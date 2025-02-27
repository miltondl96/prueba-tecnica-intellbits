import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import Head from "next/head";
import CountriesTable from "../components/CountriesTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import {
  PaginationProvider,
  usePagination,
} from "../contexts/PaginationContext";
import { Country, CountriesData } from "../types/countries";
import createApolloClient from "../../apollo-client";

const client = createApolloClient();

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      continent {
        name
      }
      currency
      emoji
    }
  }
`;

const CountriesPage = () => {
  const { loading, error, data } = useQuery<CountriesData>(GET_COUNTRIES);
  const { pagination, setPagination } = usePagination();
  const [paginatedCountries, setPaginatedCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data?.countries) {
      const filtered = searchTerm
        ? data.countries.filter(
            (country) =>
              country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              country.continent.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              (country.currency &&
                country.currency
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
          )
        : data.countries;

      setFilteredCountries(filtered);

      const totalPages = Math.ceil(filtered.length / pagination.pageSize);
      setPagination((prev) => ({
        ...prev,
        totalPages,
        currentPage:
          searchTerm && prev.currentPage > totalPages ? 1 : prev.currentPage,
      }));
    }
  }, [data, searchTerm, pagination.pageSize, setPagination]);

  // Actualizar países paginados cuando cambia la página o el filtro
  useEffect(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    setPaginatedCountries(filteredCountries.slice(startIndex, endIndex));
  }, [filteredCountries, pagination.currentPage, pagination.pageSize]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Países del Mundo
          </h1>

          <SearchBar onSearch={handleSearch} />

          {!loading && !error && filteredCountries.length === 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {`No se encontraron países que coincidan con "${searchTerm}".`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <CountriesTable
            countries={paginatedCountries}
            loading={loading}
            error={error}
          />

          {!loading && !error && filteredCountries.length > 0 && (
            <div className="mt-6">
              <Pagination />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <>
      <Head>
        <title>Directorio de Países</title>
        <meta
          name="description"
          content="Aplicación de directorio de países con GraphQL y Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ApolloProvider client={client}>
        <PaginationProvider>
          <CountriesPage />
        </PaginationProvider>
      </ApolloProvider>
    </>
  );
};

export default Home;
