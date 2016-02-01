/**
 * Created by Johnson on 2016/2/2.
 */
function log(msg){
    alert(msg);
}

var colDefs=[
    {
        name:'control'
        ,type:'control'
        ,displayName:''
    },{
        name:'empNo'
        ,type:'text'
        ,displayName:'Emp No.'
    },{
        name:'empName'
        ,type:'text'
        ,displayName:'Emp Name'
    },{
        name:'category'
        ,type:'select'
        ,displayName:'Category'
    },{
        name:'description'
        ,type:'textarea'
        ,displayName:'Description'
    }
];

var template = {
    text:'<input type="text" name="${name}" id="${id}" value="${value}"/>'
    ,select:'<select name="${name}" id="${id}" class="select2"></select>'
    ,textarea:'<textarea name="${name}" id="${id}" cols="30" rows="10">${value}</textarea>'
    ,control:
        '<span class="add control glyphicon glyphicon-plus-sign" aria-hidden="true"></span>' +
        '<span class="del control glyphicon glyphicon-minus-sign" aria-hidden="true"></span>'
};


$(document).ready(function(){
    var $table = $("#table");
    var $theader = $("<thead>");
    var $tbody = $("<tbody>");
    $table.append($theader);
    $table.append($tbody);
    var $tr = $("<tr>");
    for (var i = 0; i < colDefs.length; i++) {
        var col = colDefs[i];
        var $th = $("<th>");
        $th.text(col.displayName);
        $tr.append($th);
    }
    $theader.append($tr);



    function delRow($tr){
        $tr.remove();
    }

    function addRow(data){
        var $tr = $("<tr>");
        for (var i = 0; i < colDefs.length; i++) {
            var col = colDefs[i];
            var $td = $("<td>");
            var content = template[col.type];
            var regex = /\$\{(\w*)}/;
            while(regex.test(content)) {
                content.replace(regex,'$1');
                var key = RegExp.$1;
                var attr = col[key];
                var value = data[col["name"]];
                //console.log(key, value);
                if( key==="value" && value) {
                    content = content.replace("${" + key + "}",value);
                } else if(attr) {
                    content = content.replace("${" + key + "}",attr);
                } else {
                    content = content.replace("${" + key + "}","");
                }
            }

            console.log(content);
            $td.append($(content));
            $tr.append($td);
        }
        $(".add",$tr).click(function(){
            addRow({});
        });
        $(".del",$tr).click(function(){
            delRow($tr);
        });
        $tbody.append($tr);
    }


    //addRow({});
    addRow({empNo:2127,empName:"Johnson Lin",description:"This is a text description....\r\n...123"});

});