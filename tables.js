var dataSet = [
     [ "Add", "20001", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
    [ "Add", "20005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "Add", "20005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "Add", "20005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ]

];

var moreData = [
  
   [ "Add", "200405", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ]

];
    

$(document).ready(function() {
   var table = $('#addTable').DataTable( {
         "columnDefs": [ {
            "targets": 0,
            "data": null,
            "defaultContent": "<button>MODIFY</button>"
        } ],
        data: dataSet,
        columns: [
            { title: "ADD" },
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
  
  $('#addTable tbody').on( 'click', 'button', function () {
 
    $('#addTable').dataTable().fnDeleteRow($(this).closest('tr')[0]);
  $('#removeTable').dataTable().fnAddData($(this).closest('tr'));  
    
    
    
    
    } );
  
  $(document).ready(function() {
    $('#removeTable').DataTable( {
      "columnDefs": [ {
            "targets": 0,
            "data": null,
            "defaultContent": "<button>MODIFY</button>"
        } ],
        data: moreData,
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
    
     $('#removeTable tbody').on( 'click', 'button', function () {
 
        $('#removeTable').dataTable().fnDeleteRow($(this).closest('tr')[0]);
  $('#addTable').dataTable().fnAddData($(this).closest('tr'));  
   
    
    
    
    } );
    
    
    

} );
  
  
} );
