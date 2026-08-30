/* =====================================================
   BUS MANAGEMENT SYSTEM
   HTML + CSS + JavaScript + Bootstrap
   ===================================================== */


/* =====================================================
   COMMON FUNCTIONS
   ===================================================== */

function getData(key) {

    return JSON.parse(localStorage.getItem(key)) || [];

}


function saveData(key, data) {

    localStorage.setItem(key, JSON.stringify(data));

}


function generateId(data) {

    if (data.length === 0) {
        return 1;
    }

    return Math.max(...data.map(item => Number(item.id))) + 1;

}


function deleteRecord(key, id, displayFunction) {

    if (!confirm("Are you sure you want to delete this record?")) {
        return;
    }

    let data = getData(key);

    data = data.filter(item => Number(item.id) !== Number(id));

    saveData(key, data);

    displayFunction();

}


/* =====================================================
   DASHBOARD
   ===================================================== */

function loadDashboard() {

    const buses = getData("buses");
    const routes = getData("routes");
    const drivers = getData("drivers");
    const bookings = getData("bookings");

    const totalBuses =
        document.getElementById("totalBuses");

    const totalRoutes =
        document.getElementById("totalRoutes");

    const totalDrivers =
        document.getElementById("totalDrivers");

    const totalBookings =
        document.getElementById("totalBookings");


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


/* =====================================================
   BUS MANAGEMENT
   ===================================================== */

function clearBusForm() {

    document.getElementById("busId").value = "";
    document.getElementById("busNumber").value = "";
    document.getElementById("capacity").value = "";
    document.getElementById("driver").value = "";

}


function saveBus() {

    let buses = getData("buses");

    const id =
        document.getElementById("busId").value;

    const bus = {

        id: id ?
            Number(id) :
            generateId(buses),

        busNumber: document.getElementById("busNumber").value,

        busType: document.getElementById("busType").value,

        capacity: document.getElementById("capacity").value,

        driver: document.getElementById("driver").value,

        status: document.getElementById("busStatus").value

    };


    if (!bus.busNumber || !bus.capacity) {

        alert("Please fill required fields.");

        return;

    }


    if (id) {

        const index =
            buses.findIndex(b => Number(b.id) === Number(id));

        buses[index] = bus;

    } else {

        buses.push(bus);

    }


    saveData("buses", buses);

    displayBuses();

    bootstrap.Modal
        .getInstance(document.getElementById("busModal"))
        .hide();

}


function displayBuses() {

    const table =
        document.getElementById("busTable");

    if (!table) return;

    const buses = getData("buses");

    table.innerHTML = "";

    buses.forEach(bus => {

        table.innerHTML += `

        <tr>

            <td>${bus.id}</td>

            <td>
                <strong>${bus.busNumber}</strong>
            </td>

            <td>${bus.busType}</td>

            <td>${bus.capacity}</td>

            <td>${bus.driver}</td>

            <td>

                <span class="badge ${
                    bus.status === "Active"
                    ? "bg-success"
                    : bus.status === "Maintenance"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }">

                ${bus.status}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-sm btn-warning"
                    onclick="editBus(${bus.id})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteRecord('buses', ${bus.id}, displayBuses)">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}


function editBus(id) {

    const buses = getData("buses");

    const bus =
        buses.find(b => Number(b.id) === Number(id));

    if (!bus) return;


    document.getElementById("busId").value = bus.id;

    document.getElementById("busNumber").value =
        bus.busNumber;

    document.getElementById("busType").value =
        bus.busType;

    document.getElementById("capacity").value =
        bus.capacity;

    document.getElementById("driver").value =
        bus.driver;

    document.getElementById("busStatus").value =
        bus.status;


    new bootstrap.Modal(
        document.getElementById("busModal")
    ).show();

}


function searchBuses() {

    const value =
        document.getElementById("busSearch")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll("#busTable tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value) ?
            "" :
            "none";

    });

}


/* =====================================================
   ROUTE MANAGEMENT
   ===================================================== */

function clearRouteForm() {

    document.getElementById("routeId").value = "";
    document.getElementById("routeName").value = "";
    document.getElementById("startPoint").value = "";
    document.getElementById("destination").value = "";
    document.getElementById("distance").value = "";
    document.getElementById("fare").value = "";

}


function saveRoute() {

    let routes = getData("routes");

    const id =
        document.getElementById("routeId").value;


    const route = {

        id: id ?
            Number(id) :
            generateId(routes),

        routeName: document.getElementById("routeName").value,

        startPoint: document.getElementById("startPoint").value,

        destination: document.getElementById("destination").value,

        distance: document.getElementById("distance").value,

        fare: document.getElementById("fare").value

    };


    if (!route.routeName ||
        !route.startPoint ||
        !route.destination) {

        alert("Please fill required fields.");

        return;

    }


    if (id) {

        const index =
            routes.findIndex(r => Number(r.id) === Number(id));

        routes[index] = route;

    } else {

        routes.push(route);

    }


    saveData("routes", routes);

    displayRoutes();

    bootstrap.Modal
        .getInstance(document.getElementById("routeModal"))
        .hide();

}


function displayRoutes() {

    const table =
        document.getElementById("routeTable");

    if (!table) return;


    const routes = getData("routes");

    table.innerHTML = "";


    routes.forEach(route => {

        table.innerHTML += `

        <tr>

            <td>${route.id}</td>

            <td>
                <strong>${route.routeName}</strong>
            </td>

            <td>${route.startPoint}</td>

            <td>${route.destination}</td>

            <td>${route.distance} KM</td>

            <td>₹${route.fare}</td>

            <td>

                <button
                    class="btn btn-sm btn-warning"
                    onclick="editRoute(${route.id})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteRecord('routes', ${route.id}, displayRoutes)">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}


function editRoute(id) {

    const routes = getData("routes");

    const route =
        routes.find(r => Number(r.id) === Number(id));

    if (!route) return;


    document.getElementById("routeId").value =
        route.id;

    document.getElementById("routeName").value =
        route.routeName;

    document.getElementById("startPoint").value =
        route.startPoint;

    document.getElementById("destination").value =
        route.destination;

    document.getElementById("distance").value =
        route.distance;

    document.getElementById("fare").value =
        route.fare;


    new bootstrap.Modal(
        document.getElementById("routeModal")
    ).show();

}


function searchRoutes() {

    const value =
        document.getElementById("routeSearch")
        .value.toLowerCase();

    document.querySelectorAll("#routeTable tr")
        .forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(value) ?
                "" :
                "none";

        });

}


/* =====================================================
   DRIVER MANAGEMENT
   ===================================================== */

function clearDriverForm() {

    document.getElementById("driverId").value = "";
    document.getElementById("driverName").value = "";
    document.getElementById("driverPhone").value = "";
    document.getElementById("license").value = "";
    document.getElementById("experience").value = "";

}


function saveDriver() {

    let drivers = getData("drivers");

    const id =
        document.getElementById("driverId").value;


    const driver = {

        id: id ?
            Number(id) :
            generateId(drivers),

        name: document.getElementById("driverName").value,

        phone: document.getElementById("driverPhone").value,

        license: document.getElementById("license").value,

        experience: document.getElementById("experience").value,

        status: document.getElementById("driverStatus").value

    };


    if (!driver.name || !driver.phone) {

        alert("Please fill required fields.");

        return;

    }


    if (id) {

        const index =
            drivers.findIndex(d => Number(d.id) === Number(id));

        drivers[index] = driver;

    } else {

        drivers.push(driver);

    }


    saveData("drivers", drivers);

    displayDrivers();

    bootstrap.Modal
        .getInstance(document.getElementById("driverModal"))
        .hide();

}


function displayDrivers() {

    const table =
        document.getElementById("driverTable");

    if (!table) return;


    const drivers = getData("drivers");

    table.innerHTML = "";


    drivers.forEach(driver => {

        table.innerHTML += `

        <tr>

            <td>${driver.id}</td>

            <td>
                <strong>${driver.name}</strong>
            </td>

            <td>${driver.phone}</td>

            <td>${driver.license}</td>

            <td>${driver.experience} Years</td>

            <td>

                <span class="badge bg-success">
                    ${driver.status}
                </span>

            </td>

            <td>

                <button
                    class="btn btn-sm btn-warning"
                    onclick="editDriver(${driver.id})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteRecord('drivers', ${driver.id}, displayDrivers)">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}


function editDriver(id) {

    const drivers = getData("drivers");

    const driver =
        drivers.find(d => Number(d.id) === Number(id));

    if (!driver) return;


    document.getElementById("driverId").value =
        driver.id;

    document.getElementById("driverName").value =
        driver.name;

    document.getElementById("driverPhone").value =
        driver.phone;

    document.getElementById("license").value =
        driver.license;

    document.getElementById("experience").value =
        driver.experience;

    document.getElementById("driverStatus").value =
        driver.status;


    new bootstrap.Modal(
        document.getElementById("driverModal")
    ).show();

}


function searchDrivers() {

    const value =
        document.getElementById("driverSearch")
        .value.toLowerCase();

    document.querySelectorAll("#driverTable tr")
        .forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(value) ?
                "" :
                "none";

        });

}


/* =====================================================
   SCHEDULE MANAGEMENT
   ===================================================== */

function clearScheduleForm() {

    document.getElementById("scheduleId").value = "";
    document.getElementById("scheduleBus").value = "";
    document.getElementById("scheduleRoute").value = "";
    document.getElementById("departure").value = "";
    document.getElementById("arrival").value = "";

}


function saveSchedule() {

    let schedules = getData("schedules");

    const id =
        document.getElementById("scheduleId").value;


    const schedule = {

        id: id ?
            Number(id) :
            generateId(schedules),

        bus: document.getElementById("scheduleBus").value,

        route: document.getElementById("scheduleRoute").value,

        departure: document.getElementById("departure").value,

        arrival: document.getElementById("arrival").value,

        status: document.getElementById("scheduleStatus").value

    };


    if (!schedule.bus || !schedule.route) {

        alert("Please fill required fields.");

        return;

    }


    if (id) {

        const index =
            schedules.findIndex(s => Number(s.id) === Number(id));

        schedules[index] = schedule;

    } else {

        schedules.push(schedule);

    }


    saveData("schedules", schedules);

    displaySchedules();

    bootstrap.Modal
        .getInstance(document.getElementById("scheduleModal"))
        .hide();

}


function displaySchedules() {

    const table =
        document.getElementById("scheduleTable");

    if (!table) return;


    const schedules =
        getData("schedules");

    table.innerHTML = "";


    schedules.forEach(schedule => {

        table.innerHTML += `

        <tr>

            <td>${schedule.id}</td>

            <td>${schedule.bus}</td>

            <td>${schedule.route}</td>

            <td>${schedule.departure}</td>

            <td>${schedule.arrival}</td>

            <td>

                <span class="badge bg-primary">
                    ${schedule.status}
                </span>

            </td>

            <td>

                <button
                    class="btn btn-sm btn-warning"
                    onclick="editSchedule(${schedule.id})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteRecord('schedules', ${schedule.id}, displaySchedules)">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}


function editSchedule(id) {

    const schedules =
        getData("schedules");

    const schedule =
        schedules.find(s => Number(s.id) === Number(id));

    if (!schedule) return;


    document.getElementById("scheduleId").value =
        schedule.id;

    document.getElementById("scheduleBus").value =
        schedule.bus;

    document.getElementById("scheduleRoute").value =
        schedule.route;

    document.getElementById("departure").value =
        schedule.departure;

    document.getElementById("arrival").value =
        schedule.arrival;

    document.getElementById("scheduleStatus").value =
        schedule.status;


    new bootstrap.Modal(
        document.getElementById("scheduleModal")
    ).show();

}


/* =====================================================
   BOOKING MANAGEMENT
   ===================================================== */

function clearBookingForm() {

    document.getElementById("bookingId").value = "";
    document.getElementById("passenger").value = "";
    document.getElementById("bookingBus").value = "";
    document.getElementById("bookingRoute").value = "";
    document.getElementById("seat").value = "";
    document.getElementById("travelDate").value = "";
    document.getElementById("bookingFare").value = "";

}


function saveBooking() {

    let bookings = getData("bookings");

    const id =
        document.getElementById("bookingId").value;


    const booking = {

        id: id ?
            Number(id) :
            generateId(bookings),

        passenger: document.getElementById("passenger").value,

        bus: document.getElementById("bookingBus").value,

        route: document.getElementById("bookingRoute").value,

        seat: document.getElementById("seat").value,

        date: document.getElementById("travelDate").value,

        fare: document.getElementById("bookingFare").value,

        status: document.getElementById("bookingStatus").value

    };


    if (!booking.passenger || !booking.bus) {

        alert("Please fill required fields.");

        return;

    }


    if (id) {

        const index =
            bookings.findIndex(b => Number(b.id) === Number(id));

        bookings[index] = booking;

    } else {

        bookings.push(booking);

    }


    saveData("bookings", bookings);

    displayBookings();

    bootstrap.Modal
        .getInstance(document.getElementById("bookingModal"))
        .hide();

}


function displayBookings() {

    const table =
        document.getElementById("bookingTable");

    if (!table) return;


    const bookings =
        getData("bookings");

    table.innerHTML = "";


    bookings.forEach(booking => {

        table.innerHTML += `

        <tr>

            <td>${booking.id}</td>

            <td>
                <strong>${booking.passenger}</strong>
            </td>

            <td>${booking.bus}</td>

            <td>${booking.route}</td>

            <td>${booking.seat}</td>

            <td>${booking.date}</td>

            <td>₹${booking.fare}</td>

            <td>

                <span class="badge ${
                    booking.status === "Confirmed"
                    ? "bg-success"
                    : booking.status === "Pending"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }">

                ${booking.status}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-sm btn-warning"
                    onclick="editBooking(${booking.id})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteRecord('bookings', ${booking.id}, displayBookings)">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}


function editBooking(id) {

    const bookings =
        getData("bookings");

    const booking =
        bookings.find(b => Number(b.id) === Number(id));

    if (!booking) return;


    document.getElementById("bookingId").value =
        booking.id;

    document.getElementById("passenger").value =
        booking.passenger;

    document.getElementById("bookingBus").value =
        booking.bus;

    document.getElementById("bookingRoute").value =
        booking.route;

    document.getElementById("seat").value =
        booking.seat;

    document.getElementById("travelDate").value =
        booking.date;

    document.getElementById("bookingFare").value =
        booking.fare;

    document.getElementById("bookingStatus").value =
        booking.status;


    new bootstrap.Modal(
        document.getElementById("bookingModal")
    ).show();

}


function searchBookings() {

    const value =
        document.getElementById("bookingSearch")
        .value.toLowerCase();

    document.querySelectorAll("#bookingTable tr")
        .forEach(row => {

            row.style.display =
                row.innerText.toLowerCase().includes(value) ?
                "" :
                "none";

        });

}


/* =====================================================
   PAYMENT MANAGEMENT
   ===================================================== */

function clearPaymentForm() {

    document.getElementById("paymentId").value = "";
    document.getElementById("paymentBooking").value = "";
    document.getElementById("paymentPassenger").value = "";
    document.getElementById("amount").value = "";

}


function savePayment() {

    let payments = getData("payments");

    const id =
        document.getElementById("paymentId").value;


    const payment = {

        id: id ?
            Number(id) :
            generateId(payments),

        booking: document.getElementById("paymentBooking").value,

        passenger: document.getElementById("paymentPassenger").value,

        amount: document.getElementById("amount").value,

        method: document.getElementById("paymentMethod").value,

        status: document.getElementById("paymentStatus").value

    };


    if (!payment.booking ||
        !payment.amount) {

        alert("Please fill required fields.");

        return;

    }


    if (id) {

        const index =
            payments.findIndex(p => Number(p.id) === Number(id));

        payments[index] = payment;

    } else {

        payments.push(payment);

    }


    saveData("payments", payments);

    displayPayments();

    bootstrap.Modal
        .getInstance(document.getElementById("paymentModal"))
        .hide();

}


function displayPayments() {

    const table =
        document.getElementById("paymentTable");

    if (!table) return;


    const payments =
        getData("payments");

    table.innerHTML = "";


    payments.forEach(payment => {

        table.innerHTML += `

        <tr>

            <td>${payment.id}</td>

            <td>${payment.booking}</td>

            <td>${payment.passenger}</td>

            <td>₹${payment.amount}</td>

            <td>${payment.method}</td>

            <td>

                <span class="badge ${
                    payment.status === "Paid"
                    ? "bg-success"
                    : payment.status === "Pending"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }">

                ${payment.status}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-sm btn-warning"
                    onclick="editPayment(${payment.id})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteRecord('payments', ${payment.id}, displayPayments)">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}


function editPayment(id) {

    const payments =
        getData("payments");

    const payment =
        payments.find(p => Number(p.id) === Number(id));

    if (!payment) return;


    document.getElementById("paymentId").value =
        payment.id;

    document.getElementById("paymentBooking").value =
        payment.booking;

    document.getElementById("paymentPassenger").value =
        payment.passenger;

    document.getElementById("amount").value =
        payment.amount;

    document.getElementById("paymentMethod").value =
        payment.method;

    document.getElementById("paymentStatus").value =
        payment.status;


    new bootstrap.Modal(
        document.getElementById("paymentModal")
    ).show();

}


/* =====================================================
   INITIAL LOAD
   ===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    loadDashboard();

    displayBuses();

    displayRoutes();

    displayDrivers();

    displaySchedules();

    displayBookings();

    displayPayments();

});