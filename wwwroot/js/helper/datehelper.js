window.formatDate = function (dateString) {
    if (!dateString) return "";

    let date = new Date(dateString);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
}


//datatable render example:
//render: function (data, type) {

//    if (type === 'display' || type === 'filter') {
//        return formatDate(data);
//    }

//    return data;
//}