google.charts.load('current', { packages: ['corechart'] });
import { chart_function, finance_charts, technical_chart, technical_indicator } from "./chart.js";
import { share_price_arr, get_c_data } from "./j_query.js";


window.onload = async function() {
    await update_shareprice();
}
window.logout = logout;
window.delete_profile = delete_profile;
window.home = home;
window.truncate = truncate;
window.search_company = search_company;
window.add_company_to_watchlist = add_company_to_watchlist;
window.clear_watchlist = clear_watchlist;
window.delete_company = delete_company;
window.load_watchlist = load_watchlist;
window.section_selection = section_selection;
window.finance_charts = finance_charts;
window.technical_chart = technical_chart;
window.toggleButtons_revenue = toggleButtons_revenue;
window.tradingview_data = tradingview_data;
window.technical_indicator = technical_indicator;
window.portfoilo_page = portfoilo_page;
window.compare_page = compare_page;
window.get_c_data = get_c_data;

$(document).ready(function () {
    let isLoading = false;  // To prevent multiple clicks while loading
    try{
        $('#loading').show();
        if ($('#watchlist_items .watchlist-row').length > 0) {
            let firstCompany = $('#watchlist_items .watchlist-row:first .company-name p').text();
            console.log("Auto-selecting the first company: ", firstCompany);
            // Ensure a slight delay before fetching data to allow page components to settle
            setTimeout(() => {
                if (firstCompany && firstCompany !== undefined) {
                    showCompanyData(firstCompany);
                    section_selection('chart', firstCompany);
                }
            }, 300);
        } else {
            console.log("No companies in watchlist. Displaying empty state.");
            document.getElementById('chart_container').style.display = 'none';
            document.getElementById('fundamental_section').style.display = 'none';
            document.getElementById('technical_section').style.display = 'none';
            document.getElementById('empty_watchlist').style.display = 'block';
        }
    }
    finally{
        $('#loading').hide();
    }
    // Function to handle the display of company data and sections
    async function showCompanyData(company_symbol) {
        if (!company_symbol || isLoading) {
            console.warn("Invalid company symbol or still loading: ", company_symbol);
            return;  // Prevent fetching if no symbol or loading in progress
        }

        try {
            // Set loading state
            isLoading = true;

            // Show the loading spinner and block user input
            $('#loading').show();
            console.log("Fetching data for company symbol: ", company_symbol);

            // Reset styles and highlight selected
            $('.watchlist-row').css({'border': 'none'})
            // Simulate a delay to make sure all data is properly loaded before the next step
            await new Promise(resolve => setTimeout(resolve, 500));
            await get_c_data(company_symbol);
            await section_selection('chart', company_symbol);

        } finally {
            $(`.watchlist-row:contains(${company_symbol})`).css({'border': '2px solid white', 'border-radius': '10px'}); 
            console.log('border added');
            $('#loading').hide();
            isLoading = false;  // Reset loading state
        }
    }
    // Initialize watchlist click handlers
    function initializeWatchlistClickHandler() {
        $('#watchlist_items').off('click', '.watchlist-row').on('click', '.watchlist-row', async function () {
            if (isLoading) {
                console.log("Still loading, blocking additional clicks");
                return;  // Prevent multiple requests if loading
            }

            let company_symbol = $(this).find('.company-name p').text();
            if (!company_symbol || company_symbol === 'undefined') {
                console.error("Company symbol is undefined or missing");
                return;
            }

            // Call the showCompanyData function only if valid symbol is available
            await showCompanyData(company_symbol);
        });
    }

    // Call the function to set up the handlers
    initializeWatchlistClickHandler();
});

async function update_shareprice() {
    const watchlist = document.querySelectorAll('.watchlist-row');
    for (let company of watchlist) {
        let c_symbol = company.querySelector('.company-name p').innerText; // Corrected selector
        let s_price = company.querySelector('.share-price p'); // Corrected selector
        let shareprice = await share_price(c_symbol);
        if (shareprice !== null){
            s_price.innerText = shareprice;
        }
        else{
            s_price = 'Error';
        }
    }
}

async function truncate () {
    let url = "http://127.0.0.1:300/truncate"
    let responce = await fetch(url)
    console.log(responce.json())
}

async function delete_profile(id) {
    let url = `http://127.0.0.1:300/home/${id}/delete_account`
    let responce = await fetch(url, {method:'DELETE'})
    let data = await responce.json()
    if (data["status"] == 200){
        window.location.href = '/login'
    }
}

async function logout() {
    let url = "http://127.0.0.1:300/logout"
    let responce = await fetch(url)
    if (responce.ok){
        window.location.href = "/login"
    }
    else{
        window.location.href = "/page_not_found"
    }
}

async function search_company(user_id) {
    let search_box = document.getElementById("search-box");
    let company_name = search_box.value;
    let url = `http://127.0.0.1:300/home/${user_id}/${company_name}`;
    search_box.value = '';
    let responce = await fetch(url)
    if (responce.ok){
        let db_data = await responce.json()
        let table_body = document.getElementById('watchlist-table-body')
        table_body.innerHTML = ''
        if (db_data.watchlist.length > 0){
            db_data.watchlist.forEach((company, index) => {
                let row = document.createElement('tr')
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${company.c_name}</td>
                    <td>${company.c_symbol}</td>
                    <td>${company.share_price !== null ? company.share_price : 'not found'}</td>
                    
                `
                table_body.appendChild(row)
            })
        }
        else{
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="4" class="text-center">Add company</td>`;
            table_body.appendChild(emptyRow);
        }
    }
    else{
        console.log("Unknown error")
    }
}

async function add_company_to_watchlist(user_id) {
    let search_box = document.getElementById("search-box");
    let company_name = search_box.value;
    let url = `http://127.0.0.1:300/home/${user_id}/${company_name}/add_company`;
    search_box.value = '';

    try {
        let response = await fetch(url);
        if (response.ok) {
            load_watchlist(user_id)
        } 
        else {
            console.log("Unknown error");
            return
        }
    } 
    catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function clear_watchlist(user_id) {
    let url = `/delete_alldata_by_user/${user_id}`;
    let response = await fetch(url);
    
    if (response.ok) {
        let  data = await response.json();
        let watchlist_items = document.getElementById('watchlist_items');
        watchlist_items.innerHTML = ''; // Clear existing items
        
        // Add empty message after clearing
        let emptyMessage = document.createElement('p');
        emptyMessage.classList.add('text-center');
        emptyMessage.textContent = 'Add company';
        watchlist_items.appendChild(emptyMessage);
    } else {
        console.log(response.json());
    }
}

async function delete_company(c_symbol, user_id) {
    console.log("you clicked del button of : ",c_symbol, "user id : ", user_id)
    let url = `http://127.0.0.1:300/${user_id}/${c_symbol}/delete_company`
    let responce = await fetch(url, {method:'DELETE'})
    if (responce.ok){
        load_watchlist(user_id)
    }
    else{
        console.log("unknown error")
    }
}

async function share_price(c_symbol) {
    let url = `http://127.0.0.1:300/${c_symbol}/get/share_price`;
    let response = await fetch(url, { method: 'GET' });

    if (response.ok) {
        let data = await response.json();
        return data['share_price'];  // Return the share price directly
    } else {
        console.log('Unknown error');
        return null;  // Return null on error
    }
}

async function load_watchlist(user_id){
    console.log(user_id);
    let url = `/load_watchlist/${user_id}`
    let responce = await fetch(url, {method:'GET'})
    if (responce.ok){
        let db_data = await responce.json();
        let watchlist_items = document.getElementById('watchlist_items');
        watchlist_items.innerHTML = '';
        if (db_data.data.length > 0) {
            db_data.data.forEach((company) => {
                // Create the watchlist row
                let watchlistRow = document.createElement('div');
                watchlistRow.classList.add('watchlist-row');

                // Create company name div
                let companyNameDiv = document.createElement('div');
                companyNameDiv.classList.add('company-name');
                companyNameDiv.innerHTML = `<p>${company.c_symbol}</p>`;

                // Create share price div
                let sharePriceDiv = document.createElement('div');
                sharePriceDiv.classList.add('share-price');
                sharePriceDiv.innerHTML = `<p>${company.share_price !== null ? company.share_price : 'not found'}</p>`;

                // Create delete button
                let deleteButton = document.createElement('button');
                deleteButton.id = 'del_item'
                deleteButton.classList.add('del_item'); // Use class instead of id
                deleteButton.innerHTML = `<span class="material-symbols-outlined">delete</span>`;
                deleteButton.style.display = 'none'; // Initially hide the delete button

                deleteButton.onclick = function(){
                    delete_company(company.c_symbol, user_id)
                }

                // Show delete button on hover
                watchlistRow.addEventListener('mouseover', function() {
                    deleteButton.style.display = 'inline'; // Show the delete button on hover
                });

                watchlistRow.addEventListener('mouseleave', function() {
                    deleteButton.style.display = 'none'; // Hide the delete button when not hovering
                });

                // Append the company name, share price, and delete button to the row
                watchlistRow.appendChild(companyNameDiv);
                watchlistRow.appendChild(sharePriceDiv);
                watchlistRow.appendChild(deleteButton);

                // Append the row to the watchlist items
                watchlist_items.appendChild(watchlistRow);
                return
            });
        } 
        else {
            // Display a message if the watchlist is empty
            let emptyMessage = document.createElement('p');
            emptyMessage.classList.add('text-center');
            emptyMessage.textContent = 'Add company';
            watchlist_items.appendChild(emptyMessage);
            return
        }
    }
    else{
        console.log("data not found in watchlist")
        return
    }
}

async function tradingview_data(c_symbol) {
    let url = `/get/${c_symbol}/tradingview_data`;
    let response = await fetch(url);
    if (response.ok){
        let data = await response.json();
        return data
    }
    else{
        console.log('data not found')
    }
}

export async function section_selection(section_name, company_symbol) {
    let chart_container = document.getElementById('chart_container');
    let fundamental_section = document.getElementById('fundamental_section');
    let technical_section = document.getElementById('technical_section');
    let empty_watchlist = document.getElementById('empty_watchlist');
    let loadingSpinner = document.getElementById('loading'); // Assume this is your loading spinner element

    console.log(section_name);

    try {
        // Show the loading spinner at the start of each section change
        loadingSpinner.style.display = 'block';

        if (section_name === 'show_all') {
            chart_container.style.display = 'block';
            fundamental_section.style.display = 'block';
            technical_section.style.display = 'block';
        }

        if (section_name === 'hide_all') {
            chart_container.style.display = 'none';
            fundamental_section.style.display = 'none';
            technical_section.style.display = 'none';
        }

        if (section_name === 'chart') {
            try{
                $('#loading').show();
                chart_container.style.display = 'block';
                fundamental_section.style.display = 'none';
                technical_section.style.display = 'none';
                empty_watchlist.style.display = 'none'
    
                // Fetch and display the chart data
                let shares_arr = await share_price_arr(company_symbol, 'max');
                chart_function(company_symbol, shares_arr);
            }
            finally{
                $('#loading').hide();
            }
        }

        if (section_name === 'fundamental') {
            chart_container.style.display = 'none';
            technical_section.style.display = 'none';
            fundamental_section.style.display = 'block';
            empty_watchlist.style.display = 'none'
            // Fetch and display the fundamental data
            finance_charts(company_symbol);
        }

        if (section_name === 'technical') {
            chart_container.style.display = 'none';
            fundamental_section.style.display = 'none';
            technical_section.style.display = 'block';
            empty_watchlist.style.display = 'none'
            // Fetch technical data
            let shares_arr = await share_price_arr(company_symbol, '5y');
            if (!shares_arr || typeof shares_arr.map !== 'function') {
                console.error("Invalid data received for chart_function:", shares_arr);
                return;
            }

            // Fetch additional technical indicator data
            let tradingview = await tradingview_data(company_symbol);
            let line_data = tradingview['line_data'];
            let indicator_data = tradingview['indicator_data'];

            // Display the technical chart and indicators
            technical_chart(company_symbol, shares_arr, line_data);
            technical_indicator(indicator_data);
        }

    } catch (error) {
        console.error("Error processing section selection:", error);

    } finally {
        // Hide the loading spinner once data processing is complete
        loadingSpinner.style.display = 'none';
    }
}


// Annual and half year button operations
function toggleButtons_revenue(selected) {
    const annualBtn = document.getElementById('annualBtn');
    const halfYearBtn = document.getElementById('halfYearBtn');

    if (selected === 'annual') {
      annualBtn.classList.add('active');
      halfYearBtn.classList.remove('active');
    } else {
        halfYearBtn.classList.add('active');
        annualBtn.classList.remove('active');
    }
  }

function home(id){
    window.location.href = `/home/${id}`
}

async function signup(){
    let url = '/signup'
    let responce = await fetch(url, {method:'POST'})

}
function portfoilo_page(u_id) {
    window.location.href = `/${u_id}/portfolio`
    return
}

function compare_page(u_id) {
    window.location.href = `/${u_id}/compare`
    return
}