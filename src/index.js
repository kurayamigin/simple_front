function after_load () {
    //insert rows in table
    $.ajax({
        url: "https://restcountries.com/v3.1/all",
        success: ( countries ) => {
            console.log(countries)
            //sorting by name
            countries = countries.sort((a, b) => (a.name.official > b.name.official) ? 1 : -1);

            HTMLTemplateCountries(countries);
            initPagination();
        }
    });
}

function HTMLTemplateCountries(countries) {
    let tableElement = $("#paginated-table > tbody");
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

function openWiki(country_name) {
    $.ajax({
        url: "https://en.wikipedia.org/api/rest_v1/page/summary/" + country_name,
        success: ( wiki ) => {
            //sorting by name
            bootbox.alert(wiki.extract_html);
            }
    });
}
function initPagination() {
    let options = {
        numberPerPage:5, //Cantidad de datos por pagina
        goBar:true, //Barra donde puedes digitar el numero de la pagina al que quiere ir
        pageCounter:true, //Contador de paginas, en cual estas, de cuantas paginas
    };

    let filterOptions = {
        el:'#searchBox' //Caja de texto para filtrar, puede ser una clase o un ID
    };

    paginate.init('.paginated-table', options, filterOptions);
}

function getLanguages(languages) {
    return (languages) ? Object.values(languages).join(", ") : "N/A";
}