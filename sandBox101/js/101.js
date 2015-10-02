/**
 * Created by yc_lin on 2015/10/2.
 */
$(document).ready(function(){
    $("#execute").click(function(){
        function display(msg){
            $("#displayArea").append(msg+"<br>\n");
        }
        var count=0;
        var ApplySample=function(){
            display("<br><b>count:</b>"+count);
            display("<i>this:</i> "+this);
            display("<i>this.name:</i> "+this.name);
            display("<i>this.age:</i> "+this.age);
            display("arguments:"+arguments.length);
            count++;
        };

        var applier={
            name:'John Doe',
            age:10
        };
        display("<br>====Use Apply====");
        ApplySample.apply(applier,[1,2,3]);
        ApplySample.apply();//the 'this' references window obj
        ApplySample();//same with above

        display("<br>====Use Call====");
        ApplySample.call(applier,1,2,3);
        ApplySample.call();//the 'this' references window obj
        ApplySample();//same with above
    });
});



