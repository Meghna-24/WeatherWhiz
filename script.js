//http://api.weatherapi.com/v1/current.json?key=8799107a874443c78bb70234250902&q=Mumbai&aqi=no

const tempField = document.querySelector(".temp");
const locationField = document.querySelector(".loc_time p");
const datentimeField = document.querySelector(".loc_time span");
const weatherField = document.querySelector(".weather p");
const searchField = document.querySelector(".search");
const formField = document.querySelector("form");

formField.addEventListener('submit', searchForLoc)

let target = "Lucknow";

const fetchResults = async (targetLocation) => {
    let url = `https://api.weatherapi.com/v1/current.json?key=8799107a874443c78bb70234250902&q=${targetLocation}&aqi=no`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);

        let loc = data.location.name;
        let time = data.location.localtime;
        let temp = data.current.temp_c;
        let weathercondition = data.current.condition.text;
        let iconUrl = data.current.condition.icon;  // <-- icon URL

        updateData(temp, loc, time, weathercondition, iconUrl);
    } catch (error) {
        alert("Could not fetch data. Please enter another location.");
        console.error("Fetch error:", error);
    }
};


const toggleBtn = document.getElementById('toggle-theme');
toggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Switch Mode ☀️' : 'Switch Mode 🌙';

const dateTimeDiv = document.getElementById('current-datetime');

function updateDateTime() {
    const now = new Date();
    dateTimeDiv.textContent = now.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Switch Mode ☀️' : 'Switch Mode 🌙';

});

setInterval(updateDateTime, 60000); // update every minute
updateDateTime(); // initial call


function updateData(temp, loc, time, weathercondition, iconUrl) {
    console.log(`Returned data: ${loc}, ${time}, ${temp}°C, ${weathercondition}`);

    document.getElementById("temp-value").innerText = temp;
    locationField.innerText = loc;
    datentimeField.innerText = time;
    weatherField.innerText = weathercondition;

    const iconImg = document.getElementById("weather-icon");
    iconImg.src = "https:" + iconUrl;  // add https because API returns icon with // prefix
    iconImg.alt = weathercondition;
}



function searchForLoc(e) {
    e.preventDefault()

    target = searchField.value

    fetchResults(target)

    document.querySelector(".container").classList.add("glow");

    // Remove glow after 2 seconds
    setTimeout(() => {
        document.querySelector(".container").classList.remove("glow");
    }, 2000);
}
fetchResults(target);
