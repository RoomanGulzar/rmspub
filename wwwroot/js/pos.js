//============================================FROM POS==========================================================//
// Function to add an item to the cart
async function addToCart(itemName, itemPrice, count, itemId) {
    debugger;
    var orderId = $("#orderId").val();
    var venueId = $("#Venue").val();
    var staffId = $("#staffId").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/AddToCart',
        type: 'GET',
        dataType: 'html',
        data: { itemId: itemId, count: count, orderId: orderId, VenueId: venueId, staffId: staffId }, // Replace with your data if any
        success: async function (response) {
            // Show success toast message
            //toastr.success('Operation successful!', 'Success');
            var orderId = $("#orderId").val();

            $('#cart').html(response);
            if (orderId == 0) {
                var orderId = $("#orderId").val();
                //await UpdateCartOrderFields(orderId);
            }
            OrderTotalBill()

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
// Function to remove an item to the cart
function RemoveToCart(itemId) {
    var orderId = $("#orderId").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/RemoveToCart', // Replace with your controller and action
        type: 'GET', // or 'POST' depending on your action method
        dataType: 'html',
        data: { itemId: itemId, orderId: orderId }, // Replace with your data if any
        success: function (response) {
            // Show success toast message
            //toastr.success('Operation successful!', 'Success');
            $('#cart').html(response);
            OrderTotalBill()

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


function OrderTotalBill() {
    var orderId = $("#orderId").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/OrderTotalBill', // Replace with your controller and action
        type: 'GET', // or 'POST' depending on your action method
        dataType: 'html',
        data: { orderId: orderId }, // Replace with your data if any
        success: function (response) {
            // Show success toast message
            //toastr.success('Operation successful!', 'Success');
            $('#OrderTotalBill').html(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// change quantity of an item
function ChangeQuantity(itemId, value) {
    var quantityControl = "#quantity_" + itemId;
    var count = parseInt($(quantityControl).val() || 0) + parseInt(value);
    ChangeQuantityAjax(itemId, count)
}


async function UpdateCartOrderFields(orderId = 0) {
    $.ajax({
        url: '/OrderManagement/ManageOrder/CartOrderFields?orderId=' + orderId,
        success: function (response) {
            $('#CartOrderFields').html('');
            $('#CartOrderFields').html(response);
        }
    });
}

function ChangeQuantityAjax(itemId, count) {
    var orderId = $("#orderId").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/ChangeQuantity',
        type: 'GET',
        dataType: 'html',
        data: { itemId: itemId, count: count, orderId: orderId },
        success: function (response) {
            // Show success toast message
            //toastr.success('Operation successful!', 'Success');
            $('#cart').html(response);
            OrderTotalBill()
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
// change price of item
function ChangePrice(itemId) {
    var orderId = $("#orderId").val();
    var price = $("#input-price_" + itemId).val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/ChangePrice',
        type: 'GET',
        dataType: 'html',
        data: { itemId: itemId, price: price, orderId: orderId },
        success: function (response) {
            // Show success toast message
            //toastr.success('Operation successful!', 'Success');
            $('#cart').html(response);
            OrderTotalBill()
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
// search on category base or name
function Search(category, _this) {
    if (!category) {
        category = $("#Category").val();
    }
    var name = $("#SearchName").val();

    $.ajax({
        url: '/OrderManagement/PosPortal/Search',
        type: 'GET',
        dataType: 'html',
        data: {
            FilterValue: category,
            Search: name,
            IsEnabled: true
        },
        success: function (response) {
            $('#posItems').html(response);
            setActiveTab(_this);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
// load orders on venue base
function LoadOrder() {
    var venueId = $("#Venue").val();
    var staffId = $("#staffId").val();
    var ordno = $("#ordno").val();

    $.ajax({
        url: '/OrderManagement/PosPortal/LoadOrder',
        type: 'GET',
        dataType: 'html',
        data: {
            venueId: venueId,
            staffId: staffId,
            ordno: ordno
        },
        success: function (response) {
            $('#cart').html(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

}

function LoadVenuOrders(venueId) {
    $.ajax({
        url: '/OrderManagement/PosPortal/LoadOrder',
        type: 'GET',
        dataType: 'html',
        data: {
            venueId: venueId,
        },
        success: function (response) {
            $('#cart').html(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function LoadOrderNo() {
    debugger;
    var staffId = $("#staffId").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/LoadOrderNos',
        data: { employeeId: staffId },
        type: 'GET',
        dataType: 'html',
        success: function (response) {
            $('#orderNos').html(response);
            //LoadOrder();
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
// change discount
function ChangeDiscount(previousTotal) {
    previousTotal = parseFloat(previousTotal);
    var discount = parseFloat($("#discount").val()); // Convert the discount to a number
    var discountedTotal = previousTotal - discount; // Now this will correctly add the numbers
    $("#GrandTotal").html(discountedTotal + ".00");
    $("#totaldiscount").val(discount);
}




document.addEventListener("keydown", function (event) {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
        var orderId = $("#orderId").val();
        if (orderId && orderId > 0) {
            CheckoutOrder();
        }
    }
});
//============================================FROM POS==========================================================//



//============================================FROM LAYOUT==========================================================//

$(document).ready(function () {
    window.IsCustomer = $("#hdn_IsCustomer").val()?.toLowerCase() === "1" ? true : false;
    if (window.IsCustomer === true) {
        $("#CheckoutOrderBtn").hide()
    } else {
        $("#CheckoutOrderBtn").show()
    }

    $('#addCategoryForm').on('submit', function (e) {
        e.preventDefault();
        const categoryName = $('#categoryName').val();
        const categoryCode = $('#categoryCode').val();
        const categoryImage = $('#categoryImage').val();
        const categoryActive = $('#categoryActive').val();
        alert(`Category "${categoryName}" added successfully`);
        showPage('categoryList');
    });

    $('#addStockForm').on('submit', function (e) {
        e.preventDefault();
        const productName = $('#productName').val();
        const productCode = $('#productCode').val();
        const productCategory = $('#productCategory').val();
        const productStock = $('#productStock').val();
        const lowStockCount = $('#lowStockCount').val();
        const productImage = $('#productImage').val();
        const productSKU = $('#productSKU').val();
        const actualPrice = $('#actualPrice').val();
        const salePrice = $('#salePrice').val();
        const expiryDate = $('#expiryDate').val();
        alert(`Added "${productName}" to category "${productCategory}"`);
        showPage('stock');
    });

    $('#checkoutForm').on('submit', function (e) {
        e.preventDefault();
        const checkoutProduct = $('#checkoutProduct').val();
        const checkoutQuantity = $('#checkoutQuantity').val();
        $('#checkoutResult').html(`<p>Checked out ${checkoutQuantity} of Product ${checkoutProduct}</p>`)
            .removeClass('alert-danger')
            .addClass('alert-success');
    });
});

window.onafterprint = function () {
    //toastr.success('Operation successful!', 'Success');
};


function Refresh() {
    $.ajax({
        url: '/Dashboard/RemoveData',
        type: 'GET',
        dataType: 'html',
        success: function (response) {
            //toastr.success('Operation successful!', 'Success');
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


function PrintReceipt(containerId, flag) {
    printJS({
        printable: containerId,
        type: 'html',
        targetStyles: ['*']
    });
    setTimeout(function () {
        const printConfirmed = confirm("Did you successfully print the document?");
        if (printConfirmed) {
            KotPrinted(flag);
        }
    }, 1000);
}

function showPage(pageId) {
    $('.content > div').addClass('hidden');
    $('#' + pageId).removeClass('hidden');
    $('a.nav-link').removeClass('active');
    $(`a.nav-link[onclick="showPage('${pageId}')"]`).addClass('active');
}

function toggleInventorySubmenu() {
    $('.inventory-submenu').toggle();
}


function toggleDistributorSubmenu() {
    $('.distributor-submenu').toggle();
}


function toggleUserManagementSubmenu() {
    $('.user-management-submenu').toggle();
}

function toggleReportSubmenu() {
    $('.report-submenu').toggle();
}

function toggleSettingsSubmenu() {
    $('.settings-submenu').toggle();
}

function togglePurchaseOrderSubmenu() {
    $('.purchaseorder-submenu').toggle();
}


function createOrder() {
    var distributor = document.getElementById('distributor').value;
    var product = document.getElementById('product').value;
    var quantity = document.getElementById('quantity').value;
    var deliveryDate = document.getElementById('deliveryDate').value;

    // Add your order creation logic here
    console.log('Order Created:', {
        distributor: distributor,
        product: product,
        quantity: quantity,
        deliveryDate: deliveryDate
    });

    // Reset form
    document.getElementById('orderForm').reset();
}


let startTime = 0;
let timerInterval;

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer() {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('checkInOutTimer').textContent = formatTime(currentTime);
}

function checkIn() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById('checkInBtn').disabled = true;
    document.getElementById('checkOutBtn').disabled = false;
}

function checkOut() {
    clearInterval(timerInterval);
    document.getElementById('checkInBtn').disabled = false;
    document.getElementById('checkOutBtn').disabled = true;
    document.getElementById('checkInOutTimer').textContent = '0:00';
}

// Function to simulate checkout (reset cart)
function checkout() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalAmount = document.getElementById('cartTotalAmount');

    // Clear cart items
    if (cartItems)
        cartItems.innerHTML = '';

    // Reset total amount
    if (cartTotalAmount)
        cartTotalAmount.textContent = '0.00';
}

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

// load order's detail
function ShowDetails(orderId) {
    var venueId = $("#Venue").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/OrderDetails',
        type: 'GET',
        dataType: 'html',
        data: { orderId: orderId },
        success: function (response) {
            $('#orderdetails').html(response);
            $('#myModal').modal('show');
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// print order's detail
function PrintOrder(orderId) {
    var venueId = $("#Venue").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/OrderDetails',
        type: 'GET',
        dataType: 'html',
        async: false,
        data: { orderId: orderId },
        success: function (response) {
            $('#orderdetails').html(response);
            PrintReceipt('orderdetails');
            //$('#myModal').modal('show');
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// get kot
function GetKot() {
    debugger;
    var orderId = $("#orderId").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/OrderKot',
        type: 'GET',
        dataType: 'html',
        async: true,
        data: { orderId: orderId },
        success: async function (response) {
            $('#kotdetails').html(response);
            PrintReceipt('kotdetails');
            //await UpdateCartOrderFields();

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function KotPrinted(flag) {
    debugger;
    var orderId = $("#orderId").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/KotGenerated',
        type: 'GET',
        dataType: 'html',
        async: false,
        data: { orderId: orderId },
        success: function (response) {
            $('#cart').html(response);
            if (flag == 'checkout') {
                LoadOrder();
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// get kot
function CheckoutOrder() {
    debugger;
    var orderId = $("#orderId").val();
    var venueId = $("#hdn_venueId").val();
    var totaldiscount = $("#totaldiscount").val();
    $.ajax({
        url: '/OrderManagement/ManageOrder/Checkout',
        type: 'GET',
        dataType: 'html',
        async: false,
        data: {
            orderId: orderId,
            totalDiscount: totaldiscount,
            venueId: venueId
        },
        success: function (response) {
            const cartItems = document.getElementById('cartItems');
            const cartTotalAmount = document.getElementById('cartTotalAmount');
            // Clear cart items
            cartItems.innerHTML = '';
            // Reset total amount
            cartTotalAmount.textContent = '0.00';
            $('#orderdetails').html(response);
            PrintReceipt('orderdetails', 'checkout');
            $('#staffId').val(0);
            $('#ordno').val('');
            LoadOrder();

            //UpdateCartOrderFields();

        },
        error: function (xhr, status, error) {
            console.error(error);
            //UpdateCartOrderFields();
        }
    });
}

function Reload() {

    $.ajax({
        url: '/OrderManagement/ManageOrder/Reload',
        type: 'GET',
        dataType: 'html',
        success: function (response) {
            $('#cart').html(response);
            $('#staffId').val(0);
            $('#ordno').val("");
            //UpdateCartOrderFields();
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

}





// Adding class 'collapsed' to all <a> tags in #sidebar
$(document).ready(function () {
    debugger;

    var currentHref = window.location.href;
    //$('#sidebar a:not(.collapsed)').addClass('collapsed');
    $('#sidebar a').each(function () {
        debugger;
        $(this).removeClass('active');
        //window.location.href
        var href = window.location.href, aHref = $(this).prop('href');
        if ($(this).prop('href') && href == (aHref)) {
            if ($(this).hasClass('nested-rg')) {
                console.log('nested-rg');
                $(this).addClass('active').parent('.subMenue').show();
                $(this).parent().addClass("show").siblings('.nav-link').removeClass('collapsed');
            }
            // else {
            //     $(this).removeClass('collapsed');
            // }
        } else {
            $(this).removeClass('active');

        }
    });
});

$('#sidebar a .nested-rg').on('click', function () {
    $('#sidebar a .nested-rg').removeClass('active');
    $(this).addClass('active');
})




////document.addEventListener("keydown", function (event) {
////// Check if Shift key is pressed along with 'P'
////if (event.shiftKey && event.key === 'P') {
////window.location.href = '@Url.Action("Pos", "PosPortal", new { area = "OrderManagement" })';
////}
////// Check if Shift key is pressed along with 'C'
////else if (event.shiftKey && event.key === 'C') {
////window.location.href = '@Url.Action("Index", "CashCounter", new { area = "CashCounters" })';
////}
////});


const sidebar = document.getElementById('sidebar');
const header = document.getElementById('header');
const content = document.getElementById('content');
const toggleSidebar = document.getElementById('toggleSidebar');
if (toggleSidebar) {

    toggleSidebar.addEventListener('click', () => {
        sidebar.classList.toggle('minimized');
        header.classList.toggle('minimized');
        content.classList.toggle('minimized');
    });

}
//============================================FROM LAYOUT==========================================================//




function setActiveTab(element) {
    // remove active class from all nav-links
    document.querySelectorAll('#categoryTabs .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // add active class to the clicked link
    element.classList.add('active');
}

function setDropdownValueWithoutChange(dropdownId, value) {
    var $ddl = $("#" + dropdownId);

    // temporarily unbind change handlers
    var events = $._data($ddl[0], "events");
    var changeEvents = events?.change || [];

    // remove handlers
    changeEvents.forEach(e => $ddl.off("change", e.handler));

    // set value silently
    $ddl.val(value);

    // rebind handlers
    changeEvents.forEach(e => $ddl.on("change", e.handler));
}
