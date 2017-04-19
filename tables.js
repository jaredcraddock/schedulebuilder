// REQUIRES ECMASCRIPT 2015+
class Course {
    constructor(name, days, startTime, endTime, building) {
        this.name = name;
        this.days = days;
        this.startTime = startTime;
        this.endTime = endTime;
        this.building = building;
    }
    get getName() {
        return this.name;
    }
    get getDays() {
        return this.days;
    }
    get getStartTime() {
        return this.startTime;
    }
    get getEndTime() {
        return this.endTime;
    }
    get getBuilding() {
        return this.building;
    }
}

function wipeWeekTable() {
    var weekTableVisible = $("#weekTableContainer").is(":visible");

    if (weekTableVisible) {
        $("#weekTableContainer").fadeOut("slow", function() {
            $("#weekTableContainer p").remove();
            $("#weekTable").remove();
        });
    }
}

function prettifyTime(time) {
    time = parseInt(time);
    var period = "";
    
    if (time > 1200) {
        time = time % 1200;
        period = "PM";
    } else {
        period = "AM"
    }

    if (time >= 1000) {
        time = "" + time;
        time = time.substring(0, 2) + ":" + time.substring(2, time.length) +
               period;
    } else {
        time = "" + time;
        time = time.substring(0, 1) + ":" + time.substring(1, time.length) +
               period;
    }

    return time;
}

var scheduleData = [];

$(document).ready(function() {

    // Initially hide container so it can be shown when the user clicks the 
    // week at a glance button.
    $("#weekTableContainer").hide();

    // Definition of courseTable
    var courseTable = $('#courseTable').DataTable( {

        // Defines the first column to only have buttons and 
        // changes the width of the specified columns to 1.
        "columnDefs": [ {
            "targets": 0,
            "data": null, 
            "defaultContent": "<button id = \"addButton\">ADD</button>",
            orderable: false
        }, { 
            width: 1, 
            targets: [1, 3, 5, 6, 7] 
        } ],
        orderCellsTop: true, // tells the table to do its odering on the top most header row. This must be true
        "order": [[1, 'asc']], // Automatically puts data in ascending order in CRN column.
        "ajax": "https://kyleblud.github.io/schedulebuilder/ajax.txt",
        initComplete: function () { // wait for the table to complete initialization with its data
           this.api().columns().every(function () { // adds drop down boxes to only subject and days columns
              var column = this;
              var select = $('<select><option value=""></option></select>')
                            .appendTo( $('#courseTable thead tr#filters th#selectSearch' + $(column.header()).html()).empty() )
                            .on( 'change', function () {
                                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                column
                                    .search( val ? '^'+val+'$' : '', true, false )
                                    .draw();
                            } );
              column.data().unique().sort().each( function (d, j) {
                  select.append('<option value="'+d+'">'+d+'</option>')
              } );
          } );
        },
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "dom": "pltrip" 
    } );

    // Definition of scheduleTable
    var scheduleTable =  $('#scheduleTable').DataTable( {
        // When a row is created, push the rows data into an array, rowData
        // and push rowData into scheduleData.
        "createdRow": function(row, data, dataIndex) {
            var rowData = new Array();
            
            var numberOfColumns = 1; // data is not 0 indexed, starts at 1.
            while (data[numberOfColumns] != undefined) {
                numberOfColumns++;
            }

            for (var i = 1; i < numberOfColumns; i++) {
                rowData.push(data[i]);
            }

            scheduleData.push(rowData);
        },
        // Defines the first column to only have buttons
        "columnDefs": [ {
            "targets": 0,
            "data": null,
            "defaultContent": "<button id = \"removeButton\">REMOVE</button>",
            "sorting": false
        } ],
        "scrollX": true,
        "scrollY": "575px",
        "scrollCollapse": true,
        "paging": false,
        "dom": "t",
        "order": [[1, 'asc']],
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
            { title: "INSTRUCTOR" } ],
        data: null
    } );

    // Adds search boxes to the specified columns.
    $(courseTable.columns([1, 3, 4, 8, 9]).header()).each(function () {
        $('#courseTable thead tr#filters th#textSearch' + $(this).html()).each(function() {
            $(this).html('<input type="text" placeholder="Search" style="width: 100%"/>');
        } );
    } );

    // When the add button is clicked on the course table, the record is removed and then added to the schedule table.
    courseTable.on('click', '#addButton', function () {
        var row = courseTable.row($(this).parents('tr'));
        scheduleTable.row.add(row.node()).draw();

        row.remove();

        courseTable.draw(); // redraw the table to reflect the deletion

        wipeWeekTable();
    } );

    // when remove button is clicked on the schedule table, the row is removed and then added to the course table
    scheduleTable.on('click', '#removeButton', function () {
        var row = scheduleTable.row($(this).parents('tr'));
        var data = row.data();
        courseTable.row.add(row.node()).draw();

        row.remove();

        scheduleTable.draw(); // redraw the table to reflect the deletion

        // Remove course from scheduleData
        scheduleData.forEach(function(item, index) {
            if (item[0] == data[1]) {
                scheduleData.splice(index, 1);
            }
        });

        wipeWeekTable();
    } );

    // Apply the search for specified columns
    courseTable.columns([1, 3, 4, 8, 9]).every( function () {
        var that = this;

        // just as for adding the text searches, when applying them we have to match the text search input with the column it searches
        // the name for a column is contained in $(this.header()).html()
        $('input', $('#courseTable thead tr#filters th#textSearch' + $(this.header()).html() )).on('keyup change', function () {
            if (that.search() !== this.value) {
                that
                    .search(this.value)
                    .draw();
            }
        } );
    } );

    $("#weekTableButton").click(function() {

        // If the container is visible, do nothing.
        if ($("#weekTableContainer").is(":visible")) { return; }

        // The indices (i) for each piece of information about a given course.
        // If the database changes, change these to accomodate.
        var iName = 3;
        var iDays = 4;
        var iStartTime = 5;
        var iEndTime = 6;
        var iBuilding = 7;
        var $container = $("#weekTableContainer");

        var earliestClass = 800;    // Earliest class offered at Concord.
        var latestClass = 0;        // Latest class in students schedule.

        // For every class in scheduleData, check each end time to see if it's
        // the latest class. That way the table can end at this time.
        for (var i = 0; i < scheduleData.length; i++) {
            if (parseInt(scheduleData[i][iEndTime]) > latestClass) {
                latestClass = parseInt(scheduleData[i][iEndTime]);
            }
        }

        var rowIDs = new Array();   // Consists of IDs for tr tags table.
        var time = 0;

        // Every row will have an ID that corresponds to the time slot it 
        // represents. Each row represents 15 minute increments. 4 rows = 1 hour
        for (var hour = earliestClass; hour < latestClass; hour += 100) {
            for (var minute = 0; minute < 4; minute++) {
                time = hour + (minute * 15);
                rowIDs.push(time);
            }
        }

        var cellIDs = new Array();  // Each element in cellIDs is an array of
                                    // IDs for the td tags enclosed in a tr.
        var rowCells;
        var week = ["M", "T", "W", "R", "F"];

        // Every cell will have an ID that corresponds to the time and day it 
        // represents. For instance, the cell under the Monday column and on the 
        // 815AM row will have an ID of "M815".
        for (var row = 0; row < rowIDs.length; row++) {
            rowCells = new Array();
            for (var day = 0; day < week.length; day++) {
                rowCells.push(week[day] + rowIDs[row]);
            }
            cellIDs.push(rowCells);
        }

        // Append table to container 
        $container
            .append($("<table></table>")
                .attr("id", "weekTable")
                .addClass("cell-border")
                .addClass("dataTable"));

        var $table = $("#weekTable");

        // Append column headers to table
        $table
            .append($("<thead></thead>")
                .append($("<th></th>").text(""))
                .append($("<th></th>").text("Monday"))
                .append($("<th></th>").text("Tuesday"))
                .append($("<th></th>").text("Wednesday"))
                .append($("<th></th>").text("Thursday"))
                .append($("<th></th>").text("Friday")));

        var $row;
        var $cell;

        for (var row = 0; row < rowIDs.length; row++) {
            $row = $("<tr></tr>").attr("id", rowIDs[row]);
            // For every 4th row, create a cell spanning 4 rows which labels the 
            // start of a new hour.
            if (row % 4 == 0) {
                $cell = $("<td></td>")
                    .attr("id", cellIDs[row][cell])
                    .attr("rowspan", 4)
                    .text(prettifyTime(rowIDs[row]));
                $row.append($cell);
            }
            for (var cell = 0; cell < cellIDs[row].length; cell++) {
                $cell = $("<td></td>")
                    .attr("id", cellIDs[row][cell])
                    .addClass("free-slot");
                $row.append($cell);
            }
            $table.append($row);
        }

        var course;
        var rowspan;
        var webCourseSymbol = "--";
        var webCourses = new Array();
        var $currSlot;
        var $currRow;

        for (var i = 0; i < scheduleData.length; i++) {
            course = new Course(
                scheduleData[i][iName], 
                scheduleData[i][iDays], 
                parseInt(scheduleData[i][iStartTime]), 
                parseInt(scheduleData[i][iEndTime]), 
                scheduleData[i][iBuilding]
            );
            if (course.getDays != webCourseSymbol) {
                rowspan = Math.floor((course.getEndTime - course.getStartTime) / 25) + 1;
                for (var j = 0; j < course.getDays.length; j++) {
                    $currSlot = $("#" + course.getDays.charAt(j) + course.startTime);
                    $currRow = $currSlot.closest("tr");
                    for (var k = 0; k < rowspan; k++) {
                        if (k == 0) {
                            $currSlot
                                .attr("rowspan", rowspan)
                                .removeClass("free-slot")
                                .addClass("filled-slot")
                                .text(course.getName);
                        }
                        else {
                            $currSlot.remove();
                        }
                        $currRow = $currRow.next();
                        $currSlot = $("#" + course.getDays.charAt(j) + $currRow.attr("id"));
                    }
                }

            } else {
                webCourses.push(course.getName + ", " + course.getBuilding);
            }
        }

        if (webCourses.length != 0) {
            var courseList = "";
            $container.append("<p><strong>Courses without assigned meeting " + 
                              "times:</strong><br></p>");
            webCourses.forEach(function(item, index) {
                courseList += item + "<br>";
            });
            $("#weekTableContainer p").append(courseList);
        }

        // Show the contents of the container once it's all done.
        $container.fadeIn("slow");
    });
} );