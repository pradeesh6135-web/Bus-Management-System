function loadDashboard() {
    const buses = JSON.parse(localStorage.getItem("buses")) || [];
    const routes = JSON.parse(localStorage.getItem("routes")) || [];
    const drivers = JSON.parse(localStorage.getItem("drivers")) || [];
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const totalBuses = document.getElementById("totalBuses");
    const totalRoutes = document.getElementById("totalRoutes");
    const totalDrivers = document.getElementById("totalDrivers");
    const totalBookings = document.getElementById("totalBookings");

    if (totalBuses) {
        totalBuses.innerText = buses.length;
    }

    if (totalRoutes) {
        totalRoutes.innerText = routes.length;
    }

    if (totalDrivers) {
        totalDrivers.innerText = drivers.length;
    }

    if (totalBookings) {
        totalBookings.innerText = bookings.length;
    }
}

document.addEventListener("DOMContentLoaded", loadDashboard);