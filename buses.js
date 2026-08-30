function getBuses() {
    return JSON.parse(localStorage.getItem("buses")) || [];
}

function saveBuses(buses) {
    localStorage.setItem("buses", JSON.stringify(buses));
}

function generateBusId(buses) {
    if (buses.length === 0) {
        return 1;
    }

    return Math.max(...buses.map(bus => Number(bus.id))) + 1;
}

function clearBusForm() {
    document.getElementById("busId").value = "";
    document.getElementById("busNumber").value = "";
    document.getElementById("capacity").value = "";
    document.getElementById("driver").value = "";

    document.getElementById("busType").value = "AC";
    document.getElementById("busStatus").value = "Active";
}

function saveBus() {

    let buses = getBuses();

    const id = document.getElementById("busId").value;

    const busNumber =
        document.getElementById("busNumber").value.trim();

    const busType =
        document.getElementById("busType").value;

    const capacity =
        document.getElementById("capacity").value;

    const driver =
        document.getElementById("driver").value.trim();

    const status =
        document.getElementById("busStatus").value;

    if (!busNumber || !capacity) {
        alert("Please enter Bus Number and Capacity.");
        return;
    }

    const bus = {
        id: id ? Number(id) : generateBusId(buses),
        busNumber: busNumber,
        busType: busType,
        capacity: capacity,
        driver: driver,
        status: status
    };

    if (id) {

        const index = buses.findIndex(
            b => Number(b.id) === Number(id)
        );

        if (index !== -1) {
            buses[index] = bus;
        }

    } else {
        buses.push(bus);
    }

    saveBuses(buses);
    displayBuses();

    const modal =
        bootstrap.Modal.getInstance(
            document.getElementById("busModal")
        );

    if (modal) {
        modal.hide();
    }
}

function displayBuses() {

    const table = document.getElementById("busTable");

    if (!table) {
        return;
    }

    const buses = getBuses();

    table.innerHTML = "";

    if (buses.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    class="text-center text-muted">
                    No buses found
                </td>
            </tr>
        `;

        return;
    }

    buses.forEach(bus => {

        let statusClass = "bg-danger";

        if (bus.status === "Active") {
            statusClass = "bg-success";
        } else if (bus.status === "Maintenance") {
            statusClass = "bg-warning text-dark";
        }

        table.innerHTML += `

            <tr>

                <td>${bus.id}</td>

                <td>
                    <strong>${bus.busNumber}</strong>
                </td>

                <td>${bus.busType}</td>

                <td>${bus.capacity}</td>

                <td>${bus.driver || "-"}</td>

                <td>
                    <span class="badge ${statusClass}">
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
                        onclick="deleteBus(${bus.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>
        `;
    });
}

function editBus(id) {

    const buses = getBuses();

    const bus = buses.find(
        b => Number(b.id) === Number(id)
    );

    if (!bus) {
        return;
    }

    document.getElementById("busId").value = bus.id;
    document.getElementById("busNumber").value = bus.busNumber;
    document.getElementById("busType").value = bus.busType;
    document.getElementById("capacity").value = bus.capacity;
    document.getElementById("driver").value = bus.driver;
    document.getElementById("busStatus").value = bus.status;

    const modal = new bootstrap.Modal(
        document.getElementById("busModal")
    );

    modal.show();
}

function deleteBus(id) {

    if (!confirm("Are you sure you want to delete this bus?")) {
        return;
    }

    let buses = getBuses();

    buses = buses.filter(
        bus => Number(bus.id) !== Number(id)
    );

    saveBuses(buses);

    displayBuses();
}

function searchBuses() {

    const search =
        document.getElementById("busSearch")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll("#busTable tr");

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(search) ? "" : "none";
    });
}

document.addEventListener("DOMContentLoaded", displayBuses);