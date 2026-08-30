function getSchedules() {
    return JSON.parse(localStorage.getItem("schedules")) || [];
}

function saveSchedules(schedules) {
    localStorage.setItem(
        "schedules",
        JSON.stringify(schedules)
    );
}

function generateScheduleId(schedules) {

    if (schedules.length === 0) {
        return 1;
    }

    return Math.max(
        ...schedules.map(s => Number(s.id))
    ) + 1;
}

function clearScheduleForm() {

    document.getElementById("scheduleId").value = "";
    document.getElementById("scheduleBus").value = "";
    document.getElementById("scheduleRoute").value = "";
    document.getElementById("departure").value = "";
    document.getElementById("arrival").value = "";

    document.getElementById("scheduleStatus").value =
        "Scheduled";
}

function saveSchedule() {

    let schedules = getSchedules();

    const id =
        document.getElementById("scheduleId").value;

    const schedule = {

        id: id ?
            Number(id) :
            generateScheduleId(schedules),

        bus: document.getElementById("scheduleBus").value.trim(),

        route: document.getElementById("scheduleRoute").value.trim(),

        departure: document.getElementById("departure").value,

        arrival: document.getElementById("arrival").value,

        status: document.getElementById("scheduleStatus").value
    };

    if (!schedule.bus || !schedule.route) {

        alert("Please enter Bus and Route.");

        return;
    }

    if (id) {

        const index = schedules.findIndex(
            s => Number(s.id) === Number(id)
        );

        if (index !== -1) {
            schedules[index] = schedule;
        }

    } else {

        schedules.push(schedule);
    }

    saveSchedules(schedules);
    displaySchedules();

    const modal =
        bootstrap.Modal.getInstance(
            document.getElementById("scheduleModal")
        );

    if (modal) {
        modal.hide();
    }
}

function displaySchedules() {

    const table =
        document.getElementById("scheduleTable");

    if (!table) {
        return;
    }

    const schedules = getSchedules();

    table.innerHTML = "";

    if (schedules.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    class="text-center text-muted">
                    No schedules found
                </td>
            </tr>
        `;

        return;
    }

    schedules.forEach(schedule => {

        table.innerHTML += `

            <tr>

                <td>${schedule.id}</td>

                <td>${schedule.bus}</td>

                <td>${schedule.route}</td>

                <td>${schedule.departure}</td>

                <td>${schedule.arrival}</td>

                <td>

                    <span class="badge ${
                        schedule.status === "Running"
                        ? "bg-success"
                        : schedule.status === "Cancelled"
                        ? "bg-danger"
                        : schedule.status === "Completed"
                        ? "bg-secondary"
                        : "bg-primary"
                    }">

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
                        onclick="deleteSchedule(${schedule.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>
        `;
    });
}

function editSchedule(id) {

    const schedules = getSchedules();

    const schedule = schedules.find(
        s => Number(s.id) === Number(id)
    );

    if (!schedule) {
        return;
    }

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

function deleteSchedule(id) {

    if (!confirm("Are you sure you want to delete this schedule?")) {
        return;
    }

    let schedules = getSchedules();

    schedules = schedules.filter(
        schedule =>
        Number(schedule.id) !== Number(id)
    );

    saveSchedules(schedules);

    displaySchedules();
}

document.addEventListener("DOMContentLoaded", displaySchedules);