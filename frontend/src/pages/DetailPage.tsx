import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const GET_COUNTRY = gql`
  query GetCountry($code: String!) {
    country(code: $code) {
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

export default function DetailPage() {
  const { code } = useParams<{ code: string }>();

  const { data, loading, error } = useQuery(GET_COUNTRY, {
    variables: { code },
  });

  if (loading) return <p className="text-center py-10">Chargement…</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-600">Erreur : {error.message}</p>
    );

  if (!data?.country)
    return <p className="text-center py-10">Pays non trouvé</p>;

  const c = data.country;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <button
        onClick={() => window.history.back()}
        className="text-sm text-gray-500 hover:underline"
      >
        &larr; Retour
      </button>

      <div className="flex flex-col items-center space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <span className="text-6xl">{c.emoji}</span>
        <h1 className="text-3xl font-bold">{c.name}</h1>
        <ul className="space-y-1">
          <li>
            <strong>Code :</strong> {c.code}
          </li>
          <li>
            <strong>Continent :</strong> {c.continent?.name ?? "—"}
          </li>
        </ul>
      </div>
    </div>
  );
}
