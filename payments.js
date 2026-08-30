// =====================================================
// BUS MANAGEMENT SYSTEM
// PAYMENT MANAGEMENT
// FULL REPLACEMENT - payments.js
// =====================================================


// =====================================================
// GET PAYMENTS
// =====================================================

function getPayments() {

    try {

        const data = localStorage.getItem("payments");

        if (!data) {
            return [];
        }

        const payments = JSON.parse(data);

        return Array.isArray(payments) ?
            payments :
            [];

    } catch (error) {

        console.error(
            "Error reading payments:",
            error
        );

        return [];

    }

}


// =====================================================
// SAVE PAYMENTS
// =====================================================

function savePayments(payments) {

    try {

        localStorage.setItem(
            "payments",
            JSON.stringify(payments)
        );

        return true;

    } catch (error) {

        console.error(
            "Error saving payments:",
            error
        );

        alert(
            "Unable to save payment data."
        );

        return false;

    }

}


// =====================================================
// GENERATE PAYMENT ID
// =====================================================

function generatePaymentId(payments) {

    if (payments.length === 0) {

        return 1;

    }

    let maxId = 0;

    payments.forEach(function(payment) {

        const id = Number(payment.id);

        if (!isNaN(id) && id > maxId) {

            maxId = id;

        }

    });

    return maxId + 1;

}


// =====================================================
// CLEAR PAYMENT FORM
// =====================================================

function clearPaymentForm() {

    const paymentId =
        document.getElementById("paymentId");

    const paymentBooking =
        document.getElementById("paymentBooking");

    const paymentPassenger =
        document.getElementById("paymentPassenger");

    const amount =
        document.getElementById("amount");

    const paymentMethod =
        document.getElementById("paymentMethod");

    const paymentStatus =
        document.getElementById("paymentStatus");


    if (paymentId) {

        paymentId.value = "";

    }


    if (paymentBooking) {

        paymentBooking.value = "";

    }


    if (paymentPassenger) {

        paymentPassenger.value = "";

    }


    if (amount) {

        amount.value = "";

    }


    if (paymentMethod) {

        paymentMethod.value = "Cash";

    }


    if (paymentStatus) {

        paymentStatus.value = "Paid";

    }

}


// =====================================================
// SAVE PAYMENT
// =====================================================

function savePayment() {

    console.log(
        "savePayment() called"
    );


    let payments = getPayments();


    // =================================================
    // FORM ELEMENTS
    // =================================================

    const paymentIdElement =
        document.getElementById("paymentId");

    const bookingElement =
        document.getElementById("paymentBooking");

    const passengerElement =
        document.getElementById("paymentPassenger");

    const amountElement =
        document.getElementById("amount");

    const methodElement =
        document.getElementById("paymentMethod");

    const statusElement =
        document.getElementById("paymentStatus");


    // =================================================
    // CHECK FORM ELEMENTS
    // =================================================

    if (!paymentIdElement ||
        !bookingElement ||
        !passengerElement ||
        !amountElement ||
        !methodElement ||
        !statusElement
    ) {

        alert(
            "Payment form error! Check payments.html IDs."
        );

        console.error(
            "Payment form elements are missing."
        );

        return;

    }


    // =================================================
    // GET VALUES
    // =================================================

    const id =
        paymentIdElement.value.trim();

    const booking =
        bookingElement.value.trim();

    const passenger =
        passengerElement.value.trim();

    const amount =
        amountElement.value.trim();

    const method =
        methodElement.value;

    const status =
        statusElement.value;


    // =================================================
    // VALIDATION
    // =================================================

    if (booking === "") {

        alert(
            "Please enter Booking ID."
        );

        bookingElement.focus();

        return;

    }


    if (amount === "") {

        alert(
            "Please enter Amount."
        );

        amountElement.focus();

        return;

    }


    if (
        isNaN(Number(amount)) ||
        Number(amount) <= 0
    ) {

        alert(
            "Amount must be greater than 0."
        );

        amountElement.focus();

        return;

    }


    // =================================================
    // PAYMENT OBJECT
    // =================================================

    const payment = {

        id: id !== "" ?
            Number(id) :
            generatePaymentId(payments),

        booking: booking,

        passenger: passenger !== "" ?
            passenger :
            "-",

        amount: Number(amount),

        method: method,

        status: status

    };


    // =================================================
    // UPDATE PAYMENT
    // =================================================

    if (id !== "") {

        const index =
            payments.findIndex(
                function(item) {

                    return Number(item.id) ===
                        Number(id);

                }
            );


        if (index === -1) {

            alert(
                "Payment not found."
            );

            return;

        }


        payments[index] =
            payment;

    }


    // =================================================
    // ADD PAYMENT
    // =================================================
    else {

        payments.push(payment);

    }


    // =================================================
    // SAVE TO LOCAL STORAGE
    // =================================================

    const saved =
        savePayments(payments);


    if (!saved) {

        return;

    }


    // =================================================
    // REFRESH TABLE
    // =================================================

    displayPayments();


    // =================================================
    // CLOSE MODAL
    // =================================================

    const modalElement =
        document.getElementById(
            "paymentModal"
        );


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


    // =================================================
    // CLEAR FORM
    // =================================================

    clearPaymentForm();


    // =================================================
    // SUCCESS MESSAGE
    // =================================================

    if (id !== "") {

        alert(
            "Payment updated successfully!"
        );

    } else {

        alert(
            "Payment saved successfully!"
        );

    }

}


// =====================================================
// DISPLAY PAYMENTS
// =====================================================

function displayPayments(
    list = null
) {

    const table =
        document.getElementById(
            "paymentTable"
        );


    if (!table) {

        console.error(
            "paymentTable not found."
        );

        return;

    }


    const payments =
        list !== null ?
        list :
        getPayments();


    table.innerHTML = "";


    // =================================================
    // NO PAYMENTS
    // =================================================

    if (payments.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center text-muted py-4"
                >

                    <i
                        class="bi bi-credit-card fs-2 d-block mb-2"
                    ></i>

                    No payments found

                </td>

            </tr>

        `;

        return;

    }


    // =================================================
    // DISPLAY PAYMENTS
    // =================================================

    payments.forEach(
        function(payment) {


            let statusClass =
                "bg-danger";


            if (
                payment.status ===
                "Paid"
            ) {

                statusClass =
                    "bg-success";

            } else if (
                payment.status ===
                "Pending"
            ) {

                statusClass =
                    "bg-warning text-dark";

            } else if (
                payment.status ===
                "Refunded"
            ) {

                statusClass =
                    "bg-secondary";

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${payment.id}
                </td>


                <td>
                    ${escapeHtml(
                        payment.booking
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        payment.passenger || "-"
                    )}
                </td>


                <td>
                    ₹${Number(
                        payment.amount || 0
                    ).toFixed(2)}
                </td>


                <td>
                    ${escapeHtml(
                        payment.method
                    )}
                </td>


                <td>

                    <span
                        class="badge ${statusClass}"
                    >

                        ${escapeHtml(
                            payment.status
                        )}

                    </span>

                </td>


                <td>

                    <button
                        type="button"
                        class="btn btn-sm btn-warning me-1"
                        onclick="editPayment(${payment.id})"
                        title="Edit Payment"
                    >

                        <i
                            class="bi bi-pencil"
                        ></i>

                    </button>


                    <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        onclick="deletePayment(${payment.id})"
                        title="Delete Payment"
                    >

                        <i
                            class="bi bi-trash"
                        ></i>

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


// =====================================================
// EDIT PAYMENT
// =====================================================

function editPayment(id) {

    const payments =
        getPayments();


    const payment =
        payments.find(
            function(item) {

                return Number(item.id) ===
                    Number(id);

            }
        );


    if (!payment) {

        alert(
            "Payment not found."
        );

        return;

    }


    // =================================================
    // SET FORM VALUES
    // =================================================

    const paymentId =
        document.getElementById(
            "paymentId"
        );

    const paymentBooking =
        document.getElementById(
            "paymentBooking"
        );

    const paymentPassenger =
        document.getElementById(
            "paymentPassenger"
        );

    const amount =
        document.getElementById(
            "amount"
        );

    const paymentMethod =
        document.getElementById(
            "paymentMethod"
        );

    const paymentStatus =
        document.getElementById(
            "paymentStatus"
        );


    if (paymentId) {

        paymentId.value =
            payment.id;

    }


    if (paymentBooking) {

        paymentBooking.value =
            payment.booking || "";

    }


    if (paymentPassenger) {

        paymentPassenger.value =
            payment.passenger || "";

    }


    if (amount) {

        amount.value =
            payment.amount || "";

    }


    if (paymentMethod) {

        paymentMethod.value =
            payment.method || "Cash";

    }


    if (paymentStatus) {

        paymentStatus.value =
            payment.status || "Paid";

    }


    // =================================================
    // OPEN MODAL
    // =================================================

    const modalElement =
        document.getElementById(
            "paymentModal"
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


// =====================================================
// DELETE PAYMENT
// =====================================================

function deletePayment(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this payment?"
        );


    if (!confirmDelete) {

        return;

    }


    let payments =
        getPayments();


    const oldLength =
        payments.length;


    payments =
        payments.filter(
            function(payment) {

                return Number(payment.id) !==
                    Number(id);

            }
        );


    if (
        payments.length ===
        oldLength
    ) {

        alert(
            "Payment not found."
        );

        return;

    }


    savePayments(payments);


    displayPayments();


    alert(
        "Payment deleted successfully!"
    );

}


// =====================================================
// SEARCH PAYMENTS
// =====================================================

function searchPayments() {

    const searchInput =
        document.getElementById(
            "paymentSearch"
        );


    if (!searchInput) {

        return;

    }


    const keyword =
        searchInput.value
        .toLowerCase()
        .trim();


    const payments =
        getPayments();


    if (keyword === "") {

        displayPayments();

        return;

    }


    const filtered =
        payments.filter(
            function(payment) {

                return (

                    String(payment.id)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(payment.booking)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(payment.passenger)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(payment.amount)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(payment.method)
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(payment.status)
                    .toLowerCase()
                    .includes(keyword)

                );

            }
        );


    displayPayments(filtered);

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

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


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "payments.js loaded successfully."
        );

        displayPayments();

    }
);