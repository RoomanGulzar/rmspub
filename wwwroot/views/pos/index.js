
toastr.options = {
    "closeButton": true, // Show close button
    "debug": false,
    "newestOnTop": false,
    "progressBar": false, // Show progress bar
    "positionClass": "toast-bottom-center", // Position of the toast
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000", // How long the toast will be visible
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

var CurrentOrderId = "#CurrentOrderId";
var VenueId = "#VenueId";
var EmployeeId = "#EmployeeId"; //Waiter
var OrderNo = "#OrderNo"; //Waiter
let cartQueue = Promise.resolve();

async function addToCart(count, itemId) {
    cartQueue = cartQueue.then(() => handleAddToCart(count, itemId))
        .catch(err => console.error("Queue error:", err));
}

async function handleAddToCart(count, itemId) {

    var orderId = $(CurrentOrderId).val();
    var venueId = $("#Venue").val();
    var staffId = $("#staffId").val();

    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/POS/AddToCart',
            type: 'GET',
            dataType: 'html',
            data: {
                ItemId: itemId,
                Count: count,
                OrderId: orderId,
                VenueId: venueId,
                StaffId: staffId
            },
            success: async function (response) {

                $('#pos-sidebar').html(response);

                var newOrderId = $(CurrentOrderId).val();
                // you can update order fields here if needed

                resolve();
            },
            error: function (xhr, status, error) {
                console.error(error);
                reject(error);
            }
        });
    });
}

function ApplyEmployeeFilter() {
    var empId = $(EmployeeId).val();
    var ordNo = $(OrderNo).val();
    PosCartAjax(empId, '')
}
function PosCart() {
    var empId = $(EmployeeId).val();
    var ordNo = $(OrderNo).val();
    PosCartAjax(empId, ordNo)
}
async function PosCartAjax(empId, OrderNo) {

    await $.ajax({
        url: '/Pos/PosCart',
        data: {
            // OrderId: $(CurrentOrderId).val(),
            EmployeeId: empId,
            //VenueId: $(VenueId).val(),
            OrderNo: OrderNo,
        },
        type: 'GET',
        success: function (data) {
            $('#pos-sidebar').html('');
            $('#pos-sidebar').html(data);
        },
        error: function () {
            toastr.error('Failed to load cart.', 'Error');
        }
    });
}

async function ResetPosCart() {
    $(EmployeeId).val(0)
    $(VenueId).val(0)
    $(OrderNo).val('')
    await PosCart();

}

async function AssignPosCart() {
    var AssignEmployeeId = $("#AssignEmployeeId").val();
    var AssginVenueId = $("#AssginVenueId").val();
    if ((!AssignEmployeeId && !AssginVenueId) || (AssignEmployeeId == "" && AssginVenueId == "")) {
        return;
    }


    await $.ajax({
        url: '/Pos/AssignPosCart',
        data: {
            OrderId: $(CurrentOrderId).val(),
            //OrderNo: $(CurrentOrderId).val(),
            EmployeeId: $("#AssignEmployeeId").val(),
            VenueId: $("#AssginVenueId").val(),
        },
        type: 'POST',
        success: function (data) {
            $('#pos-sidebar').html('');
            $('#pos-sidebar').html(data);
        },
        error: function (xhr, msg) {
            if (xhr.responseText) {
                toastr.error(xhr.responseText, 'Error');
            } else {
                toastr.error('Failed to load cart.', 'Error');
            }
            //ResetAssignPosCart()
        }
    });
}

async function ResetAssignPosCart() {
    $("#AssignEmployeeId").val('');
    $("#AssginVenueId").val('');


}

// get kot
async function CheckoutOrder() {
    debugger;
    var orderId = $(CurrentOrderId).val();
    window.LastOrderId = orderId;
    var venueId = $(VenueId).val();
    var totaldiscount = $("#totaldiscount").val();
    await $.ajax({
        url: '/Pos/CheckOutOrder',
        type: 'GET',
        async: true,
        data: {
            orderId: orderId,
            totalDiscount: totaldiscount,
            venueId: venueId
        },
        success: function (response) {
            if (response.status === true) {
                PrintInvoice(window.LastOrderId);
                toastr.info("Checkout successful — order is closed.")
            }
            ResetPosCart()
        },
        error: function (xhr, status, error) {
            console.error(error);
            //UpdateCartOrderFields();
        }
    });
}


async function PrintReceipt(containerId, flag) {
    printJS({
        printable: containerId,
        type: 'html',
        targetStyles: ['*']
    });
    setTimeout(function () {
        const printConfirmed = confirm("Did you successfully print the document?");
        if (printConfirmed) {
            PosKotPrinted(flag);
        }
    }, 500);
}

async function PosKotPrinted(flag) {
    debugger;
    var orderId = $(CurrentOrderId).val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/KotGenerated',
        type: 'GET',
        dataType: 'html',
        async: false,
        data: { orderId: orderId },
        success: function (response) {
            //$('#cart').html(response);
            if (flag == 'checkout') {
                LoadOrder();
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


async function ChangeDiscount(previousTotal) {
    previousTotal = parseFloat(previousTotal);
    var discount = parseFloat($("#discount").val()); // Convert the discount to a number
    var discountedTotal = previousTotal - discount; // Now this will correctly add the numbers
    $("#GrandTotal").html(discountedTotal + ".00");
    $("#totaldiscount").val(discount);
}


async function Search(category, _this) {
    if (!category) {
        category = $("#Category").val();
    }
    //var name = $("#SearchName").val();

    await $.ajax({
        url: '/OrderManagement/PosPortal/Search',
        type: 'GET',
        dataType: 'html',
        data: {
            FilterValue: category,
            //Search: name,
            IsEnabled: true
        },
        success: function (response) {
            $('#posItems').html('');
            $('#posItems').html(response);
            setActiveTab(_this);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
// load orders on venue base

function setActiveTab(element) {
    // remove active class from all nav-links
    document.querySelectorAll('#categoryTabs .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // add active class to the clicked link
    element.classList.add('active');
}
function PrintInvoice(orderId) {
    if (orderId == 0 || !orderId) {
        toastr.error('No order selected to print invoice.', 'Error');
        return;
    }
    //window.open('/Pos/PrintInvoice?orderId=' + orderId, '_blank');
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '/Pos/PrintInvoice?orderId=' + orderId;
    document.body.appendChild(iframe);

    iframe.onload = function () {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };
}
function PrintKOT(orderId) {
    // Get Current order ID from UI
    let current = $(CurrentOrderId); // ensure CurrentOrderId = "#OrderId" or similar

    // If orderId not passed, use current value
    if (!orderId || orderId == 0) {
        if (current.length == 0 || !current.val() || current.val() == "0") {
            toastr.error('No order selected to print KOT.', 'Error');
            return;
        }
        orderId = current.val();
    }

    // Create hidden iframe
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '/Pos/PrintKOT?orderId=' + orderId;
    document.body.appendChild(iframe);

    iframe.onload = function () {
        try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } catch (e) {
            console.error("Print error:", e);
        }

        // Remove iframe after print
       // setTimeout(() => iframe.remove(), 2000);
    };
}




async function IncQuantity(itemId, value) {
    var quantityControl = "#quantity_" + itemId;
    var count = parseInt($(quantityControl).val() || 0) + parseInt(value);
    ChangeQuantity(itemId, count)
}
async function DecQuantity(itemId, value) {
    var quantityControl = "#quantity_" + itemId;
    var count = parseInt($(quantityControl).val() || 0) - parseInt(value);
    ChangeQuantity(itemId, count)
}
async function ChangeQuantity(itemId, value) {
    ChangeQuantityAjax(itemId, value)
}
async function ChangeQuantityAjax(itemId, count) {
    var orderId = $(CurrentOrderId).val();
    $.ajax({
        url: '/POS/ChangeQuantity',
        type: 'GET',
        dataType: 'html',
        data: { itemId: itemId, count: count, orderId: orderId },
        success: function (data) {
            $('#pos-sidebar').html('');
            $('#pos-sidebar').html(data);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


function RemoveToCart(itemId) {
    var orderId = $(CurrentOrderId).val();
    $.ajax({
        url: '/POS/RemoveToCart', // Replace with your controller and action
        type: 'GET', // or 'POST' depending on your action method
        dataType: 'html',
        data: { itemId: itemId, orderId: orderId }, // Replace with your data if any
        success: function (data) {
            $('#pos-sidebar').html('');
            $('#pos-sidebar').html(data);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
