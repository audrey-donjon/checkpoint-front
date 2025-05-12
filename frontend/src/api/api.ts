// This file contains all the GraphQL queries and mutations used in the app
import { gql } from "@apollo/client";

// --- QUERIES ---
export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      emoji
      continent {
        name
      }
    }
  }
`;

export const GET_COUNTRY = gql`
  query GetCountry($countryCode: String!) {
    country(code: $countryCode) {
      code
      name
      emoji
      continent {
        name
      }
    }
  }
`;

export const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      id
      name
    }
  }
`;

// --- MUTATIONS ---
export const ADD_COUNTRY = gql`
  mutation AddCountry($data: NewCountryInput!) {
    addCountry(data: $data) {
      id
      code
      name
      emoji
      continent {
        id
        name
      }
    }
  }
`;

export const ADD_CONTINENT = gql`
  mutation AddContinent($data: NewContinentInput!) {
    addContinent(data: $data) {
      id
      name
    }
  }
`;
