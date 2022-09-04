import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

//========FUNCTIONS==================
const clearContent = () => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};

const searchCountry = event => {
  const findCountry = event.target.value.trim();
  if (!findCountry) {
    clearContent();
    return;
  }
  fetchCountries(findCountry)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearContent();
        return;
      } else if (country.length === 1) {
        clearContent(countryList.innerHTML);
        renderCountryInfo(country);
      } else if (country.length > 1 && country.length <= 10) {
        clearContent(countryInfo.innerHTML);
        renderCountryList(country);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearContent();
      return error;
    });
};

//==========RENDERING 1 COUNTRY=========================
const renderCountryList = country => {
  const markup = country
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="${name.official}" width="100" height="60"><p>${name.official}</p></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
};

//=========RENDERING 10 OR LESS COUNTRIES=================
const renderCountryInfo = country => {
  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<section><h1><img src="${flags.svg}" alt="${
        name.official
      }" width="100" height="60">&nbsp ${name.official}</h1>
      <p><span>Capital: </span>&nbsp ${capital}</p>
      <p><span>Population:</span>&nbsp ${population}</p>
      <p><span>Languages:</span>&nbsp ${Object.values(languages)}</p><section>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
};

//=========EVENT LISTENER============
inputCountry.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
