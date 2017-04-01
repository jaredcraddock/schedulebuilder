
var scheduleData = [ // placeholder for data to be stored by scheduleTable

];


$(document).ready(function() {
    // NOTE: DataTable and dataTable are two different things!!!
    // DataTable is newer and provides more of an API than dataTable
    // However, dataTable can access the new API. Example $('#Table').dataTable().api().-----

    // Definition of courseTable
    var $courseTable = $('#courseTable').DataTable( {

        // column definintions
        "columnDefs": [ {
<<<<<<< HEAD
            "targets": 0,
            "data": null,
            "defaultContent": "<button id = \"addButton\">ADD</button>"
            } ],
        "ajax": "https://kyleblud.github.io/schedulebuilder/ajax.txt",
=======
            "targets": 0, // I want this set of options inside { } to only affect column index 0
            "data": null, // no external data will be stored in this column
            "defaultContent": "<button id = \"addButton\">ADD</button>", // creates an add button for the column
            //"sorting": false, // sorting is useless in this column but the sorting icon still appears in the header. hmm..
            orderable: false
          }, { width: 1, targets: [1,3,5,6,7]} // sets a really small width of certain columns to make sure they aren't bigger than they need to be
        ],
        orderCellsTop: true, // tells the table to do its odering on the top most header row. This must be true
        "order": [[1, 'asc']], // start with asc order on column 1

        // Data sources
        "ajax": "ajax.txt",

        // visuals
        initComplete: function () { // wait for the table to complete initialization with its data
           this.api().columns().every( function () { // adds drop down boxes to only subject and days columns
              var column = this;

              // the logic for this is the same as adding text search input boxes
              // append the html code for select searches to the table header row with the filters id
              // then listen for a change to occur and then fire the code that searches the table's column
              var select = $('<select><option value=""></option></select>')
                  .appendTo( $('#courseTable thead tr#filters th#selectSearch' + $(column.header()).html()).empty() )
                  .on( 'change', function () {
                      var val = $.fn.dataTable.util.escapeRegex(
                          $(this).val()
                      );

                      column
                          .search( val ? '^'+val+'$' : '', true, false ) // I have no idea
                          .draw();
                  } );

              column.data().unique().sort().each( function ( d, j ) {
                  select.append( '<option value="'+d+'">'+d+'</option>' )
              } );
          } );
        },
>>>>>>> jaredcraddock/master
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "dom": "pltrip" // these change how the information is displayed to the user
          // the order in which these characters are in determine how it looks
          // l - length changing input control ( Show X entries )
          // f - filtering input ( this is what needed to be removed )
          // t - the table itself
          // i - the information summary
          // p - pagination control (this can be in multiple spots e.g. above and below the table)
          // r - processing display element
    } );

    // Definition of scheduleTable
    var $scheduleTable =  $('#scheduleTable').DataTable( {

        // visuals
        "scrollX": true,
        "scrollY": "575px",
        "scrollCollapse": true,
        "paging":         false,
        "dom": "t", // there must be at least a "t" in this or else the searches in the coursesTable mess up
        "order": [[1, 'asc']],

        // column definitions
        "columnDefs": [ { // creates a remove button for column 0 without sorting or any external data
            "targets": 0,
            "data": null,
            "defaultContent": "<button id = \"removeButton\">REMOVE</button>",
            "sorting": false
            } ],
        columns: [
            { title: "" },
            { title: "CRN" },
            { title: "SUBJ" },
            { title: "CRS" },
            { title: "TITLE" },
            { title: "DAYS" },
            { title: "STARTS" },
            { title: "ENDS" },
            { title: "ROOM" },
            { title: "INSTRUCTOR" }
            ],

        // data sources
        data: scheduleData
    } );

    // goes through each column index specified and adds the text input to the column footers
    $( $courseTable.columns([1,3,4,8,9]).header()).each( function () {
        // Due to the limitations on DataTable, only one header row can be the header for a column and there isn't a way to access multiple header rows
        // So instead, the html file contains id's with textSearch + column name to differentiate between the different columns
        // for every column in the loop, we insert the input html code only for id's containing textSearch so we don't mix it up with selectSearch
        $('#courseTable thead tr#filters th#textSearch' + $(this).html()).each(function() {
          $(this).html( '<input type="text" placeholder="Search" style="width: 100%"/>' );
        } );
    } );


    // when the add button is clicked on the course table, the record is removed and then added to the schedule table
    $courseTable.on( 'click', '#addButton', function () {
        //$('#courseTable').dataTable().fnDeleteRow($(this).closest('tr')[0]);
        //$('#scheduleTable').dataTable().fnAddData($(this).closest('tr'));
        var row = $courseTable.row( $(this).parents('tr') );
        $scheduleTable.row.add( row.node() ).draw(); // DataTables add rows by their nodes and not the actual row. The table must be drawn again to refelct the changes

        row.remove();

        $courseTable.draw(); // redraw the table to reflect the deletion
    } );


    // when remove button is clicked on the schdule table, the row is removed and then added to the course table
    $scheduleTable.on( 'click', '#removeButton', function () {
        //$('#scheduleTable').dataTable().fnDeleteRow($(this).closest('tr')[0]);
        //$('#courseTable').dataTable().fnAddData($(this).closest('tr'));
        var row = $scheduleTable.row( $(this).parents('tr') );
        $courseTable.row.add( row.node() ).draw(); // DataTables add rows by their nodes and not the actual row. The table must be drawn again to refelct the changes
        row.remove();

        $scheduleTable.draw(); // redraw the table to reflect the deletion
    } );

    // Apply the search for specified columns
    $courseTable.columns([1,3,4,8,9]).every( function () {
        var that = this;

        // just as for adding the text searches, when applying them we have to match the text search input with the column it searches
        // the name for a column is contained in $(this.header()).html()
        $( 'input', $('#courseTable thead tr#filters th#textSearch' + $(this.header()).html() )).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value )
                    .draw();
            }
        } );
    } );
} );
