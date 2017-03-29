var removeData = [



];


$(document).ready(function() {
  var table = $('#addTable').DataTable( {
    "columnDefs": [ {
            "targets": 0,
            "data": null,
            "defaultContent": "<button>MODIFY</button>"
        } ],
        "ajax": 'ajax.txt',
        "dom": "ltipr"
    } );

 var table2 =  $('#removeTable').DataTable( {
      "scrollX": true,
      "scrollY":        "575px",
        "scrollCollapse": true,
        "paging":         false,
      "columnDefs": [ {
            "targets": 0,
            "data": null,
            "defaultContent": "<button>MODIFY</button>"
        } ],
        data: removeData,
        columns: [
            { title: "REMOVE" },
            { title: "CRN" },
            { title: "SUBJ" },
            { title: "CRS" },
            { title: "TITLE" },
            { title: "DAYS" },
            { title: "STARTS" },
            { title: "ENDS" },
            { title: "ROOM" },
            { title: "INSTRUCTOR" }
        ]
    } );


  // Setup - add a text input to each footer cell
    $('#addTable tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Search" />' );
    } );

   $('#addTable tbody').on( 'click', 'button', function () {

    $('#addTable').dataTable().fnDeleteRow($(this).closest('tr')[0]);
$('#removeTable').dataTable().fnAddData($(this).closest('tr'));




    } );

  $('#removeTable tbody').on( 'click', 'button', function () {

    $('#removeTable').dataTable().fnDeleteRow($(this).closest('tr')[0]);
  $('#addTable').dataTable().fnAddData($(this).closest('tr'));




    } );


    // Apply the search
    table.columns().every( function () {
        var that = this;

        $( 'input', this.footer() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value )
                    .draw();
            }
        } );
    } );
} );
