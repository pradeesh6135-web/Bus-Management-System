function getRoutes() {
    return JSON.parse(localStorage.getItem("routes")) || [];
}

function saveRoutes(routes) {
    localStorage.setItem("routes", JSON.stringify(routes));
}

function generateRouteId(routes) {

    if (routes.length === 0) {
        return 1;
    }

    return Math.max(
        ...routes.map(route => Number(route.id))
    ) + 1;
}

function clearRouteForm() {

    document.getElementById("routeId").value = "";
    document.getElementById("routeName").value = "";
    document.getElementById("startPoint").value = "";
    document.getElementById("destination").value = "";
    document.getElementById("distance").value = "";
    document.getElementById("fare").value = "";
}

function saveRoute() {

    let routes = getRoutes();

    const id =
        document.getElementById("routeId").value;

    const route = {

        id: id ?
            Number(id) :
            generateRouteId(routes),

        routeName: document.getElementById("routeName").value.trim(),

        startPoint: document.getElementById("startPoint").value.trim(),

        destination: document.getElementById("destination").value.trim(),

        distance: document.getElementById("distance").value,

        fare: document.getElementById("fare").value
    };

    if (!route.routeName ||
        !route.startPoint ||
        !route.destination) {

        alert("Please fill all required fields.");
        return;
    }

    if (id) {

        const index = routes.findIndex(
            r => Number(r.id) === Number(id)
        );

        if (index !== -1) {
            routes[index] = route;
        }

    } else {

        routes.push(route);
    }

    saveRoutes(routes);
    displayRoutes();

    const modal =
        bootstrap.Modal.getInstance(
            document.getElementById("routeModal")
        );

    if (modal) {
        modal.hide();
    }
}

function displayRoutes() {

    const table =
        document.getElementById("routeTable");

    if (!table) {
        return;
    }

    const routes = getRoutes();

    table.innerHTML = "";

    if (routes.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    class="text-center text-muted">
                    No routes found
                </td>
            </tr>
        `;

        return;
    }

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
                        onclick="deleteRoute(${route.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>
        `;
    });
}

function editRoute(id) {

    const routes = getRoutes();

    const route = routes.find(
        r => Number(r.id) === Number(id)
    );

    if (!route) {
        return;
    }

    document.getElementById("routeId").value = route.id;
    document.getElementById("routeName").value = route.routeName;
    document.getElementById("startPoint").value = route.startPoint;
    document.getElementById("destination").value = route.destination;
    document.getElementById("distance").value = route.distance;
    document.getElementById("fare").value = route.fare;

    new bootstrap.Modal(
        document.getElementById("routeModal")
    ).show();
}

function deleteRoute(id) {

    if (!confirm("Are you sure you want to delete this route?")) {
        return;
    }

    let routes = getRoutes();

    routes = routes.filter(
        route => Number(route.id) !== Number(id)
    );

    saveRoutes(routes);

    displayRoutes();
}

function searchRoutes() {

    const search =
        document.getElementById("routeSearch")
        .value
        .toLowerCase();

    document.querySelectorAll("#routeTable tr")
        .forEach(row => {

            row.style.display =
                row.innerText
                .toLowerCase()
                .includes(search) ?
                "" :
                "none";
        });
}

document.addEventListener("DOMContentLoaded", displayRoutes);