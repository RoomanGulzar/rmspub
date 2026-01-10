
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

function ToggleSliderbar() {
    console.log(21, 'pos slider')
    $("#pos").toggleClass("pos-mobile-sidebar-toggled")
}

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
    debugger;
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
    //if ((!AssignEmployeeId && !AssginVenueId) || (AssignEmployeeId == "" && AssginVenueId == "")) {
    //    return;
    //}

    var orderId = $(CurrentOrderId).val();
    //if (AssignEmployeeId) {
    //    ApplyEmployeeFilter();
    //}
    //if (!orderId) {
    //    return;
    //}
    await $.ajax({
        url: '/Pos/AssignPosCart',
        data: {
            OrderId: orderId,
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

let timeOut = null


async function Search(category, _this) {
    if (timeOut != null) {
        clearTimeout(timeOut);
    }
    timeOut = setTimeout(function () {
        SearchDebounce(category, _this)
    }, 500)
}
async function SearchDebounce(category, _this) {

    if (!category) {
        category = $("#Category").val();
    } else {
        $("#Category").val(category)
    }
    var name = $("#SearchName").val();

    await $.ajax({
        url: '/POS/Search',
        type: 'GET',
        dataType: 'html',
        data: {
            FilterValue: category,
            Search: name,
            IsEnabled: true
        },
        success: function (response) {
            $('#posItems').html('');
            $('#posItems').html(response);
            if (_this) {
                setActiveTab(_this);
            }

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


async function IncQuantity(itemId, value) {
    var quantityControl = "#quantity_" + itemId;
    var count = parseFloat($(quantityControl).val() || 0) + parseFloat(value);
    ChangeQuantity(itemId, count)
}
async function DecQuantity(itemId, value) {
    var quantityControl = "#quantity_" + itemId;
    var count = parseFloat($(quantityControl).val() || 0) - parseFloat(value);
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


async function nativePrintPDF(url) {
    try {
        // Fetch PDF binary
        const response = await fetch(url);
        const blob = await response.blob();

        if (blob.type !== "application/pdf") {
            console.error("Not a PDF");
            return;
        }

        // Create PDF URL
        const pdfURL = URL.createObjectURL(blob);

        // Open PDF in new window for printing
        const printWindow = window.open(pdfURL, "_blank");

        if (!printWindow) {
            alert("Popup blocked! Please allow popups for printing.");
            return;
        }
        try {

            // Auto-print when loaded
            printWindow.focus();
            printWindow.print();
        } catch (e) {

        }
        //printWindow.onload = function () {
        //};

    } catch (err) {
        console.error("PDF Print Error:", err);
    }
}
async function nativePrintHTML(url) {
    try {
        // Fetch HTML response
        const response = await fetch(url);
        const html = await response.text();

        if (!html || html.trim().length === 0) {
            console.error("Empty HTML response");
            return;
        }

        // Open a new window
        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            alert("Popup blocked! Please allow popups for printing.");
            return;
        }

        // Write HTML to new window
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

        //// Wait for content to load, then print
        //printWindow.onload = function () {
        //    printWindow.focus();
        //    printWindow.print();
        //    // Optional: close after print
        //     printWindow.close();
        //};
        setTimeout(function () {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 100);
    } catch (err) {
        console.error("HTML Print Error:", err);
    }
}

function PrintInvoice(orderId) {

    ///the below code is responible for pinting itext pdf invoices
    if (!orderId || orderId == 0) {
        toastr.error('No order selected to print invoice.', 'Error');
        return;
    }
    nativePrintHTML(`/Pos/PrintInvoice?orderId=${orderId}&isHtml=true`)
    return;
    nativePrintPDF(`/Pos/PrintInvoice?orderId=${orderId}`);
}
function PrintKOT(orderId) {
    let current = $(CurrentOrderId);

    if (!orderId || orderId == 0) {
        if (!current.val() || current.val() == "0") {
            toastr.error('No order selected to print KOT.', 'Error');
            return;
        }
        orderId = current.val();
    }

    nativePrintHTML(`/Pos/PrintKOT?orderId=${orderId}&isHtml=true`);
    return;
    nativePrintPDF(`/Pos/PrintKOT?orderId=${orderId}`);
}


function bindSelect(selectId, data, defaultText, defaultValue = 'Select', selectedValue = null) {
    const $select = $(selectId);

    // 1️⃣ Clear existing options
    $select.empty();

    // 2️⃣ Add default option
    $select.append(
        $('<option>', {
            value: '--',
            text: defaultText
        })
    );

    // 3️⃣ Add options from list
    $.each(data, function (i, item) {
        $select.append(
            $('<option>', {
                value: item.value,
                text: item.text,
                selected: item.selected === true || (selectedValue != null && item.value == selectedValue)
            })
        );
    });
}

var chars = new Array();
var pressed = false;
$(document).on("keydown", function (e) {
    if (e.which >= 48 && e.which <= 57) {
        chars.push(e.key);
    }

    if (pressed === false) {

        setTimeout(function () {

            if (chars.length >= 8) {
                var $focused = $(':focus');
                if (!$focused.is(':button')) {
                    $focused.val("");
                }

                var barcode = chars.join("");

                // assign value to some input (or do whatever you want)
                //addToCart(barcode);
                // alert(barcode);
                barcode = "";
            }
            chars = [];
            pressed = false;
        }, 500);
    }
    pressed = true;
});
function simulateScan(barcode) {
    let index = 0;

    function triggerNextChar() {
        if (index >= barcode.length) return;

        const char = barcode.charAt(index);
        index++;
        ///console.log('char at',index,'is',char);
        const e = new KeyboardEvent("keydown", {
            key: char,
            bubbles: true,
            which: String.fromCharCode(char)
        });

        document.dispatchEvent(e);

        setTimeout(triggerNextChar, 10); // scanner speed
    }

    triggerNextChar();
}
