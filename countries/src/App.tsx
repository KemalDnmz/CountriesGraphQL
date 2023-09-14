import "./App.css";
import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
const GET_COUNTRIES = gql`
  query {
    countries {
      code
      name
      native
      continent {
        name
      }
    }
  }
`;

type Country = {
  code: string;
  name: string;
  native: string;
  continent: {
    name: string;
  };
};

const App: React.FC = () => {
  const { loading, error, data } = useQuery(GET_COUNTRIES);
  const [filter, setFilter] = useState<string>("");
  const [selected, setSelected] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isClicked, setIsClicked] = useState(true);

  useEffect(() => {
    if (data && data.countries) {
      // Data render edildiğinde ülkelerin geldiği ve listede kaçıncı ülkenin seçili olacağının ayarlandığı yer.
      setCountries(data.countries);
      const toSelect =
        data.countries.length >= 10 ? 9 : data.countries.length - 1;
      setSelected(data.countries[toSelect].code);
    }
  }, [data]);

  const handleSelect = (code: string) => {
    setSelected(code);
    setIsClicked(!isClicked);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.includes(filter)
  );

  useEffect(() => {
    // Filtre uygulandığında, filtrelenmiş ülkeler içinde 10. ülkenin ya da ülke sayısı 10'dan küçük ise son sıradakini ülkenin seçildiği yer
    const toSelect =
      filteredCountries.length >= 10 ? 9 : filteredCountries.length - 1;
    setSelected(filteredCountries[toSelect]?.code || null);
  }, [filter]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="d-flex justify-content-center">
      <form className="formSet">
        <div className="inputDiv">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search Countries..."
            className="my-5 form-control inputSet "
          />
        </div>

        <ul className="list-group">
          {filteredCountries.map((country) => (
            <li
              key={country.code}
              className="list-group-item"
              onClick={() => handleSelect(country.code)}
              style={{
                backgroundColor: isClicked
                  ? selected === country.code
                    ? " var(--dark-color)"
                    : "transparent"
                  : selected === country.code
                  ? "transparent"
                  : "transparent",
                color: isClicked
                  ? selected === country.code
                    ? "var(--light-color)"
                    : "black"
                  : selected === country.code
                  ? "var(--dark-color)"
                  : "",
              }}
            >
              {country.name} ({country.native})
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
};

export default App;
