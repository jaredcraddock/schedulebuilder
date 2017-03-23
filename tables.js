var addData = [
     [ "", "20001", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
    [ "", "20006", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "", "21005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "", "23005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "", "21005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "", "21005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "", "21005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "", "21005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "", "21005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ],
  [ "", "21005", "ACCT", "205", "Accounting I", "MW", "11:00", "12:15", "Rahall(318)", "Khanlarian" ]

];

var removeData = [
  
   

];
    

$(document).ready(function() {
   var table = $('#addTable').DataTable( {
     "scrollY":        "200px",
        "scrollCollapse": true,
        "paging":         false,
         "columnDefs": [ {
            "targets": 0,
            "data": null,
            "defaultContent": "<button>MODIFY</button>"
           
        } ],
     
     
        data: addData,
     
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
      "scrollY":        "200px",
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
    
     $('#removeTable tbody').on( 'click', 'button', function () {
 
        $('#removeTable').dataTable().fnDeleteRow($(this).closest('tr')[0]);
  $('#addTable').dataTable().fnAddData($(this).closest('tr'));  
   
    
    
    
    } );
    
    
    

} );
  
  
} );
