import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COUNTRIES, GET_CONTINENTS, ADD_COUNTRY } from "../api/api";
import { CardTitle, CardContent, Card, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type CountryForm = {
  code: string;
  name: string;
  emoji: string;
  continentId: string;
};

export function HomePage() {
  const form = useForm<CountryForm>({
    defaultValues: {
      code: "",
      name: "",
      emoji: "",
      continentId: "",
    },
  });

  const {
    data: countryData,
    loading: countryLoading,
    error: countryError,
  } = useQuery(GET_COUNTRIES);

  const { data: contData } = useQuery(GET_CONTINENTS);

  const [addCountry, { loading: addLoading, error: addError }] = useMutation(
    ADD_COUNTRY,
    {
      refetchQueries: [{ query: GET_COUNTRIES }],
    }
  );

  const onSubmit = form.handleSubmit(async (values) => {
    await addCountry({
      variables: {
        data: {
          code: values.code,
          name: values.name,
          emoji: values.emoji,
          continent: { id: Number(values.continentId) },
        },
      },
    });
    form.reset(); // remet à zéro
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-4">
        Checkpoint : Frontend
      </h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="bg-card-light dark:bg-card-dark">
          <CardHeader>
            <CardTitle>Ajouter un pays</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                {(["code", "name", "emoji"] as const).map((field) => (
                  <FormField
                    key={field}
                    control={form.control} // <-- on passe form.control
                    name={field}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">
                          {field.name}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name="continentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Continent</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!contData}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionne" />
                          </SelectTrigger>
                          <SelectContent>
                            {contData?.continents.map((c: any) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={addLoading}>
                  {addLoading ? "Enregistrement…" : "Ajouter"}
                </Button>
                {addError && (
                  <p className="text-sm text-red-500 mt-2">
                    Erreur : {addError.message}
                  </p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
        <div>
          {countryLoading && <p>Chargement…</p>}
          {countryError && (
            <p className="text-red-500">Erreur : {countryError.message}</p>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {countryData?.countries.map((c: any) => (
              <Link
                to={`/pays/${c.code}`}
                key={c.code}
                className="block hover:no-underline"
              >
                <Card
                  key={c.code}
                  className="bg-card-light dark:bg-card-dark hover:shadow-lg transition"
                >
                  <CardHeader className="flex items-center space-x-4 p-4">
                    <span className="text-4xl">{c.emoji}</span>
                    <div>
                      <CardTitle>{c.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {c.code} — {c.continent?.name || "—"}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
