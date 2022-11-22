import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
    evt.preventDefault()
  const name = searchBox.value.trim()
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '')
  }

  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = ''
      countryInfo.innerHTML = ''
      if (countries.length === 1) {
        countryList.insertAdjacentHTML('beforeend', markupCountryList(countries))
        countryInfo.insertAdjacentHTML('beforeend', markupCountryInfo(countries))
      } else if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
      } else if (countries.length > 1 && countries.length <= 10){
        countryList.insertAdjacentHTML('beforeend', markupCountryList(countries))
      }
      else{
        Notiflix.Notify.failure('Oops, there is no country with that name')
      }
    })
    }

    
 function markupCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 60px height = 60px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
    })
    .join('')
      return markup
}

function markupCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>
        `
    })
    .join('')
  return markup
}

