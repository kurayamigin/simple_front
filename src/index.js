//This function is called on document.body
function after_document_load () {
    loadCountries();
}

function loadCountries() {
    $.ajax({
        url: "https://restcountries.com/v3.1/all",
        success: ( countries ) => {
            //sorting by name
            countries = countries.sort((a, b) => (a.name.official > b.name.official) ? 1 : -1);
            HTMLTemplateCountries(countries, $("#paginated-table > tbody"));
            initPagination('.paginated-table');
        }
    });
}

/** Append on tableElement, tr's for each country.
 *
 * @param countries array with countries in json/oject format
 * @param tableElement table body to append HTML td's.
 */
function HTMLTemplateCountries(countries, tableElement) {
    let templateBase = `<tr class='country_row' onclick="openWiki('{name}')">
        <td>{name}</td>
        <td>{capital}</td>
        <td>{region}</td> 
        <td>{languages}</td> 
        <td>{population}</td> 
        <td><img class='flag' src='{flag_url}'></td>
        </tr>`
    countries.forEach((country) => {
        var template = templateBase
            .replaceAll("{name}", country.name.official)
            .replace("{capital}", (country.capital) ? country.capital[0] : "N/A")
            .replace("{region}", country.region)
            .replace("{languages}", getLanguages(country.languages)) //The api returns languages as keys in a object {eng: "english", sp:"spanish"}
            .replace("{population}", country.population)
            .replace("{flag_url}", country.flags.png);
        tableElement.append(template);
    });
}

/**
 * Open modal with wikipedia api's html_text response.
 * @param country_name
 */
function openWiki(country_name) {
    $.ajax({
        url: "https://en.wikipedia.org/api/rest_v1/page/summary/" + country_name,
        success: ( wiki ) => {
            //sorting by name
            bootbox.alert(wiki.extract_html);
            }
    });
}

/**
 * give pagination and style for a table.
 * @param table table html id, to give pagination.
 */
function initPagination(table) {
    let options = {
        numberPerPage:5,
        goBar:true,
        pageCounter:true
    };
    let filterOptions = {
        el:'#searchBox'
    };
    paginate.init(table, options, filterOptions);
}

/**
 * returns a string containing the languages in comma separates format.
 * @param languages
 * @returns {string|string}
 */
function getLanguages(languages) {
    return (languages) ? Object.values(languages).join(", ") : "N/A";
}