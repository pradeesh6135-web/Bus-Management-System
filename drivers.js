function getDrivers() {
    return JSON.parse(localStorage.getItem("drivers")) || [];
}

function saveDrivers(drivers) {
    localStorage.setItem("drivers", JSON.stringify(drivers));
}

function generateDriverId(drivers) {

    if (drivers.length === 0) {
        return 1;
    }

    return Math.max(
        ...drivers.map(driver => Number(driver.id))
    ) + 1;
}

function clearDriverForm() {

    document.getElementById("driverId").value = "";
    document.getElementById("driverName").value = "";
    document.getElementById("driverPhone").value = "";
    document.getElementById("license").value = "";
    document.getElementById("experience").value = "";

    document.getElementById("driverStatus").value =
        "Available";
}

function saveDriver() {

    let drivers = getDrivers();

    const id =
        document.getElementById("driverId").value;

    const driver = {

        id: id ?
            Number(id) :
            generateDriverId(drivers),

        name: document.getElementById("driverName").value.trim(),

        phone: document.getElementById("driverPhone").value.trim(),

        license: document.getElementById("license").value.trim(),

        experience: document.getElementById("experience").value,

        status: document.getElementById("driverStatus").value
    };

    if (!driver.name || !driver.phone) {

        alert("Please enter Driver Name and Phone.");

        return;
    }

    if (id) {

        const index = drivers.findIndex(
            d => Number(d.id) === Number(id)
        );

        if (index !== -1) {
            drivers[index] = driver;
        }

    } else {

        drivers.push(driver);
    }

    saveDrivers(drivers);
    displayDrivers();

    const modal =
        bootstrap.Modal.getInstance(
            document.getElementById("driverModal")
        );

    if (modal) {
        modal.hide();
    }
}

function displayDrivers() {

    const table =
        document.getElementById("driverTable");

    if (!table) {
        return;
    }

    const drivers = getDrivers();

    table.innerHTML = "";

    if (drivers.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    class="text-center text-muted">
                    No drivers found
                </td>
            </tr>
        `;

        return;
    }

    drivers.forEach(driver => {

        table.innerHTML += `

            <tr>

                <td>${driver.id}</td>

                <td>
                    <strong>${driver.name}</strong>
                </td>

                <td>${driver.phone}</td>

                <td>${driver.license || "-"}</td>

                <td>${driver.experience || 0} Years</td>

                <td>

                    <span class="badge ${
                        driver.status === "On Duty"
                        ? "bg-primary"
                        : driver.status === "Available"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }">

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
                        onclick="deleteDriver(${driver.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>
        `;
    });
}

function editDriver(id) {

    const drivers = getDrivers();

    const driver = drivers.find(
        d => Number(d.id) === Number(id)
    );

    if (!driver) {
        return;
    }

    document.getElementById("driverId").value = driver.id;
    document.getElementById("driverName").value = driver.name;
    document.getElementById("driverPhone").value = driver.phone;
    document.getElementById("license").value = driver.license;
    document.getElementById("experience").value = driver.experience;
    document.getElementById("driverStatus").value = driver.status;

    new bootstrap.Modal(
        document.getElementById("driverModal")
    ).show();
}

function deleteDriver(id) {

    if (!confirm("Are you sure you want to delete this driver?")) {
        return;
    }

    let drivers = getDrivers();

    drivers = drivers.filter(
        driver => Number(driver.id) !== Number(id)
    );

    saveDrivers(drivers);

    displayDrivers();
}

function searchDrivers() {

    const search =
        document.getElementById("driverSearch")
        .value
        .toLowerCase();

    document.querySelectorAll("#driverTable tr")
        .forEach(row => {

            row.style.display =
                row.innerText
                .toLowerCase()
                .includes(search) ?
                "" :
                "none";
        });
}

document.addEventListener("DOMContentLoaded", displayDrivers);