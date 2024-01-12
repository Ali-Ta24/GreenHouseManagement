var area = $("#LetterTemplate");
var ProgramDataTable = area.DataTable({
    //serverSide: true, //make server side processing to true
    ajax:
    {
        contentType: 'application/json',
        url: '/api/LetterTemplate/GetAll',
    },
    searching: false,
    select: true,
    info: false,
    columns: [

        { data: "name", name: "name", type: "html" },
        { data: "to", name: "to", type: "html" },
        { data: "userName", name: "userName", type: "html" },
        { data: "lastModificationTime", name: "lastModificationTime", type: "html", render: function (data, type, row) { return getPerianDateTime(data) } },
        { data: "descript", name: "descript", type: "html" },

        /* ,*/

    ]


});//DataTable


ProgramDataTable.on('select', function (event, dt, type, indexes) {
    let valueRowSelect = ProgramDataTable.rows({ selected: true }).data()[0];

    if (valueRowSelect != undefined) {
        $("#editCapacityBtn").removeClass("d-none");

        event.stopPropagation();
    }

}).on('deselect', function (event, dt, type, indexes) {
    $("#editCapacityBtn").addClass("d-none");

});

function Edittemplate() {
let valueRowSelect = ProgramDataTable.rows({ selected: true }).data()[0];
    document.location = "/LetterTemplate/EditTemplate/?id=" + valueRowSelect.id;
    
    return false;

    
    $.ajax({
        url: "/LetterTemplate/EditTemplate/?id=" + valueRowSelect.id,
        type: "Get",
        success: function (res) {
            bootbox.dialog({
                message: res,
                title: "اصلاح قالب " + valueRowSelect.name,
                size:"large"

            }).init(function () {
                $('#Description').val(valueRowSelect.descript);
                //$('#edit').html(valueRowSelect.template);
                xxxxx.html.set(valueRowSelect.template);
            });
        }

    })
}

function resetGrid() {
    ProgramDataTable.rows().deselect();
    ProgramDataTable.ajax.reload();
}

//function saveAccounting() {
//    var xx = $('div#edit').froalaEditor('html.get');
//   //console.log( jQuery($('div#edit').froalaEditor('html.get')).text())
//}
