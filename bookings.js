// ======================================================
// BUS MANAGEMENT SYSTEM
// BOOKING MANAGEMENT - FULL REPLACEMENT
// ======================================================


// ==================== GET BOOKINGS ====================

function getBookings() {
    try {
        const data = localStorage.getItem("bookings");

        if (!data) {
            return [];
        }

        const bookings = JSON.parse(data);

        return Array.isArray(bookings) ? bookings : [];

    } catch (error) {
        console.error("Error loading bookings:", error);
        return [];
    }
}


// ==================== SAVE BOOKINGS ====================

function saveBookings(bookings) {
    try {
        localStorage.setItem(
            "bookings",
            JSON.stringify(bookings)
        );

        return true;

    } catch (error) {
        console.error("Error saving bookings:", error);

        alert("Unable to save booking data.");

        return false;
    }
}


// ==================== GENERATE BOOKING ID ====================

function generateBookingId(bookings) {

    if (bookings.length === 0) {
        return 1;
    }

    let maxId = 0;

    bookings.forEach(function(booking) {

        const id = Number(booking.id);

        if (!isNaN(id) && id > maxId) {
            maxId = id;
        }

    });

    return maxId + 1;
}


// ==================== CLEAR FORM ====================

function clearBookingForm() {

    const bookingId = document.getElementById("bookingId");
    const passenger = document.getElementById("passenger");
    const bookingBus = document.getElementById("bookingBus");
    const bookingRoute = document.getElementById("bookingRoute");
    const seat = document.getElementById("seat");
    const travelDate = document.getElementById("travelDate");
    const bookingFare = document.getElementById("bookingFare");
    const bookingStatus = document.getElementById("bookingStatus");

    if (bookingId) bookingId.value = "";
    if (passenger) passenger.value = "";
    if (bookingBus) bookingBus.value = "";
    if (bookingRoute) bookingRoute.value = "";
    if (seat) seat.value = "";
    if (travelDate) travelDate.value = "";
    if (bookingFare) bookingFare.value = "";

    if (bookingStatus) {
        bookingStatus.value = "Confirmed";
    }
}


// ==================== SAVE BOOKING ====================

function saveBooking() {

    console.log("Save Booking clicked");

    let bookings = getBookings();


    // GET VALUES

    const idElement = document.getElementById("bookingId");
    const passengerElement = document.getElementById("passenger");
    const busElement = document.getElementById("bookingBus");
    const routeElement = document.getElementById("bookingRoute");
    const seatElement = document.getElementById("seat");
    const dateElement = document.getElementById("travelDate");
    const fareElement = document.getElementById("bookingFare");
    const statusElement = document.getElementById("bookingStatus");


    // CHECK ELEMENTS

    if (!idElement ||
        !passengerElement ||
        !busElement ||
        !routeElement ||
        !seatElement ||
        !dateElement ||
        !fareElement ||
        !statusElement
    ) {

        alert(
            "Booking form error! Check bookings.html IDs."
        );

        console.error(
            "Booking form elements are missing."
        );

        return;
    }


    // VALUES

    const id = idElement.value.trim();

    const passenger =
        passengerElement.value.trim();

    const bus =
        busElement.value.trim();

    const route =
        routeElement.value.trim();

    const seat =
        seatElement.value.trim();

    const date =
        dateElement.value;

    const fare =
        fareElement.value.trim();

    const status =
        statusElement.value;


    // ==================== VALIDATION ====================

    if (passenger === "") {

        alert("Please enter Passenger Name.");

        passengerElement.focus();

        return;
    }


    if (bus === "") {

        alert("Please enter Bus Number.");

        busElement.focus();

        return;
    }


    if (route === "") {

        alert("Please enter Route.");

        routeElement.focus();

        return;
    }


    if (seat === "") {

        alert("Please enter Seat Number.");

        seatElement.focus();

        return;
    }


    if (date === "") {

        alert("Please select Travel Date.");

        dateElement.focus();

        return;
    }


    if (fare === "") {

        alert("Please enter Fare.");

        fareElement.focus();

        return;
    }


    if (
        isNaN(Number(fare)) ||
        Number(fare) <= 0
    ) {

        alert("Please enter a valid Fare.");

        fareElement.focus();

        return;
    }


    // ==================== CHECK DUPLICATE SEAT ====================

    const duplicateSeat = bookings.some(
        function(booking) {

            return (

                String(booking.bus).toLowerCase() ===
                bus.toLowerCase()

                &&

                String(booking.date) === date

                &&

                String(booking.seat).toLowerCase() ===
                seat.toLowerCase()

                &&

                Number(booking.id) !==
                Number(id || 0)

                &&

                booking.status !== "Cancelled"

            );

        }
    );


    if (duplicateSeat) {

        alert(
            "This seat is already booked for this bus and date."
        );

        return;
    }


    // ==================== BOOKING OBJECT ====================

    const booking = {

        id: id !== "" ?
            Number(id) :
            generateBookingId(bookings),

        passenger: passenger,

        bus: bus,

        route: route,

        seat: seat,

        date: date,

        fare: Number(fare),

        status: status

    };


    // ==================== UPDATE ====================

    if (id !== "") {

        const index =
            bookings.findIndex(
                function(item) {

                    return Number(item.id) ===
                        Number(id);

                }
            );


        if (index === -1) {

            alert("Booking not found.");

            return;
        }


        bookings[index] = booking;

    }


    // ==================== ADD ====================
    else {

        bookings.push(booking);

    }


    // ==================== SAVE ====================

    const saved =
        saveBookings(bookings);


    if (!saved) {
        return;
    }


    // ==================== DISPLAY ====================

    displayBookings();


    // ==================== CLOSE MODAL ====================

    const modalElement =
        document.getElementById("bookingModal");


    if (
        modalElement &&
        typeof bootstrap !== "undefined"
    ) {

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.hide();
    }


    // ==================== CLEAR FORM ====================

    clearBookingForm();


    // ==================== SUCCESS MESSAGE ====================

    if (id !== "") {

        alert(
            "Booking updated successfully!"
        );

    } else {

        alert(
            "Booking saved successfully!"
        );

    }

}


// ==================== DISPLAY BOOKINGS ====================

function displayBookings(data = null) {

    const table =
        document.getElementById("bookingTable");


    if (!table) {

        console.error(
            "bookingTable not found."
        );

        return;
    }


    const bookings =
        data !== null ?
        data :
        getBookings();


    table.innerHTML = "";


    // NO DATA

    if (bookings.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="text-center text-muted py-4"
                >

                    <i class="bi bi-ticket-perforated fs-2"></i>

                    <br>

                    No bookings found

                </td>

            </tr>

        `;

        return;
    }


    // DISPLAY DATA

    bookings.forEach(
        function(booking) {


            let badgeClass = "bg-danger";


            if (
                booking.status === "Confirmed"
            ) {

                badgeClass =
                    "bg-success";

            } else if (
                booking.status === "Pending"
            ) {

                badgeClass =
                    "bg-warning text-dark";

            } else if (
                booking.status === "Cancelled"
            ) {

                badgeClass =
                    "bg-danger";

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${booking.id}
                </td>

                <td>
                    <strong>
                        ${escapeBooking(
                            booking.passenger
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeBooking(
                        booking.bus
                    )}
                </td>

                <td>
                    ${escapeBooking(
                        booking.route
                    )}
                </td>

                <td>
                    ${escapeBooking(
                        booking.seat || "-"
                    )}
                </td>

                <td>
                    ${escapeBooking(
                        booking.date || "-"
                    )}
                </td>

                <td>
                    ₹${Number(
                        booking.fare || 0
                    ).toFixed(2)}
                </td>

                <td>

                    <span
                        class="badge ${badgeClass}"
                    >

                        ${escapeBooking(
                            booking.status
                        )}

                    </span>

                </td>

                <td>

                    <button
                        type="button"
                        class="btn btn-sm btn-warning me-1"
                        onclick="editBooking(${booking.id})"
                    >

                        <i class="bi bi-pencil"></i>

                    </button>


                    <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        onclick="deleteBooking(${booking.id})"
                    >

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// ==================== EDIT BOOKING ====================

function editBooking(id) {

    const bookings =
        getBookings();


    const booking =
        bookings.find(
            function(item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!booking) {

        alert("Booking not found.");

        return;
    }


    document.getElementById(
        "bookingId"
    ).value = booking.id;


    document.getElementById(
        "passenger"
    ).value = booking.passenger || "";


    document.getElementById(
        "bookingBus"
    ).value = booking.bus || "";


    document.getElementById(
        "bookingRoute"
    ).value = booking.route || "";


    document.getElementById(
        "seat"
    ).value = booking.seat || "";


    document.getElementById(
        "travelDate"
    ).value = booking.date || "";


    document.getElementById(
        "bookingFare"
    ).value = booking.fare || "";


    document.getElementById(
            "bookingStatus"
        ).value =
        booking.status || "Confirmed";


    // OPEN MODAL

    const modalElement =
        document.getElementById(
            "bookingModal"
        );


    if (
        modalElement &&
        typeof bootstrap !== "undefined"
    ) {

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();
    }

}


// ==================== DELETE BOOKING ====================

function deleteBooking(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this booking?"
        );


    if (!confirmation) {
        return;
    }


    let bookings =
        getBookings();


    const oldLength =
        bookings.length;


    bookings =
        bookings.filter(
            function(booking) {

                return Number(booking.id) !==
                    Number(id);

            }
        );


    if (
        bookings.length ===
        oldLength
    ) {

        alert("Booking not found.");

        return;
    }


    saveBookings(bookings);

    displayBookings();


    alert(
        "Booking deleted successfully!"
    );

}


// ==================== SEARCH BOOKINGS ====================

function searchBookings() {

    const searchElement =
        document.getElementById(
            "bookingSearch"
        );


    if (!searchElement) {
        return;
    }


    const keyword =
        searchElement.value
        .toLowerCase()
        .trim();


    const bookings =
        getBookings();


    if (keyword === "") {

        displayBookings();

        return;
    }


    const filtered =
        bookings.filter(
            function(booking) {

                return (

                    String(booking.id)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(booking.passenger)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(booking.bus)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(booking.route)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(booking.seat)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(booking.date)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(booking.status)
                    .toLowerCase()
                    .includes(keyword)

                );

            }
        );


    displayBookings(filtered);

}


// ==================== ESCAPE HTML ====================

function escapeBooking(value) {

    return String(value)

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

}


// ==================== PAGE LOAD ====================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "bookings.js loaded successfully"
        );

        displayBookings();

    }
);