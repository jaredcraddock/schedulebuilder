
var removeData = [];

$(document).ready(function() {
    // NOTE: DataTable and dataTable are two different things!!!
    // DataTable is newer and provides more of an API than dataTable
    // However, dataTable can access the new API. Example $('#Table').dataTable().api().-----

    // Definition of courseTable
    var courseTable = $('#courseTable').DataTable( {
        "columnDefs": [ {
            "targets": 0,
            "data": null,
            "defaultContent": "<button>ADD</button>"
            } ],
        "ajax": "ajax.txt",
        "dom": "lptrip" // these change how the information is displayed to the user
          // the order in which these characters are in determine how it looks
          // l - length changing input control ( Show X entries )
          // f - filtering input ( this is what needed to be removed )
          // t - the table itself
          // i - the information summary
          // p - pagination control (this can be in multiple spots e.g. above and below the table)
          // r - processing display element
    } );

    // Definition of scheduleTable
    var scheduleTable =  $('#scheduleTable').DataTable( {
        "scrollX": true,
        "scrollY": "575px",
        "scrollCollapse": true,
        "paging":         false,
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "columnDefs": [ {
            "targets": 0,
            "data": null,
            "defaultContent": "<button>REMOVE</button>"
            } ],
        "dom": "t", // there must be at least a "t" in this or else the searches in the coursesTable mess up
        data: removeData,
        columns: [
            { title: "ACTION" },
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

    // goes through each column index specified and adds the text input to the column footers
    courseTable.columns([1,2,3,4,5,6,7,8,9]).footer().each( function () {
        $(this).html( '<input type="text" placeholder="Search" />' );
    } );

    // when the add button is clicked on the course table, the record is removed and then added to the schedule table
    courseTable.on( 'click', 'button', function () {
        //$('#courseTable').dataTable().fnDeleteRow($(this).closest('tr')[0]);
        //$('#scheduleTable').dataTable().fnAddData($(this).closest('tr'));
        var row = courseTable.row( $(this).parents('tr') );
        scheduleTable.row.add( row.node() ).draw();

        row.remove();

        courseTable.draw();
    } );

    // when remove button is clicked on the schdule table, the row is removed and then added to the course table
    scheduleTable.on( 'click', 'button', function () {
        //$('#scheduleTable').dataTable().fnDeleteRow($(this).closest('tr')[0]);
        //$('#courseTable').dataTable().fnAddData($(this).closest('tr'));
        var row = scheduleTable.row( $(this).parents('tr') );
        courseTable.row.add( row.node() ).draw();
        row.remove();

        scheduleTable.draw();
    } );

    // Apply the search for specified columns
    courseTable.columns([1,2,3,4,5,6,7,8,9]).every( function () {
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
