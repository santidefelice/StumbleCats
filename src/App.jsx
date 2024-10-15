import { useEffect, useState } from 'react';
import './App.css';
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
const API_URL = 'https://api.thecatapi.com/v1/images/search';

function App() {
  const [currentCat, setCurrentCat] = useState(null);
  const [banList, setBanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRandomCat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?api_key=${ACCESS_KEY}`);
      const data = await response.json();
      const cat = data[0];


      const hasBannedAttribute = banList.some(bannedItem =>
        cat.breeds.length > 0 && (
          cat.breeds[0].name.includes(bannedItem) ||
          cat.breeds[0].origin.includes(bannedItem) ||
          cat.breeds[0].temperament.includes(bannedItem)
        )
      );

      if(hasBannedAttribute) {
        fetchRandomCat();
      } else{
        setCurrentCat(cat);
      }
    } catch (error) {
      console.error('Error fetching random cat', error);
    } finally {
      setIsLoading(false);
    }
  }

  const addToBanList = (attribute) => {
    if(!banList.includes(attribute)) {
      setBanList([...banList, attribute]);
    }
  };

  useEffect(() => {
    fetchRandomCat();
  }, []);

  return (
    <div className="stumble-app">
    <h1>Cat Stumble</h1>
    {isLoading ? (
      <p>Loading...</p>
    ) : currentCat && currentCat.breeds && currentCat.breeds.length > 0 ? (
      <div className="cat-display">
        <img src={currentCat.url} alt="Random Cat" style={{ maxWidth: '100%', height: 'auto' }} />
        <div className="cat-attributes">
          <p onClick={() => addToBanList(currentCat.breeds[0].name)}>
            Breed: {currentCat.breeds[0].name}
          </p>
          <p onClick={() => addToBanList(currentCat.breeds[0].origin)}>
            Origin: {currentCat.breeds[0].origin}
          </p>
          <p>Temperament:</p>
          <ul>
            {currentCat.breeds[0].temperament.split(', ').map((trait, index) => (
              <li key={index} onClick={() => addToBanList(trait)}>
                {trait}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ) : (
      <p>No cat data available</p>
    )}
    <button onClick={fetchRandomCat} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Next Cat'}
    </button>
    <div className="ban-list">
      <h2>Ban List</h2>
      <ul>
        {banList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default App
