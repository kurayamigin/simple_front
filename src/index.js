
$.ajax({
    url: "https://restcountries.com/v3.1/all",
    success: function ( countries ) {
        console.log(countries)
        HTMLTemplateCountries(countries);
        initPagination();
    }
});


function after_load () {
    //insert rows in table

}

function HTMLTemplateCountries(countries) {
    let tableElement = $("#paginated-table > tbody");
    let templateBase = "<tr> " +
        "<td>{name}</td>" +
        "<td>{capital}</td>" +
        "<td>{region}</td>" +
        "<td>{languages}</td>" +
        "<td>{population}</td>" +
        "<td><img class='flag' src='{flag_url}'></td>" +
        "</tr>"
    countries.forEach(function (country) {
        var template = templateBase
            .replace("{name}", country.name.official)
            .replace("{capital}", (country.capital) ? country.capital[0] : "N/A")
            .replace("{region}", country.region)
            .replace("{languages}", getLanguages(country.languages)) //The api returns languages as keys in a object {eng: "english", sp:"spanish"}
            .replace("{population}", country.population)
            .replace("{flag_url}", country.flags.png);
        tableElement.append(template);
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