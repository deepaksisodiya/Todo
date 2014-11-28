/**
 * Created by chetan on 29/11/14.
 */

function todo() {

}

todo.prototype = {
    add : function() {
        var description = $("#description").val();

        if(description === "") {
            $("#alert").html("<strong>Warning!</strong> You left the to-do empty");
            $('#alert').fadeIn().delay(1000).fadeOut();
            return false;
        }else {
            $("#toDo_list").prepend("<li>"+ description +"</li>");
            $("#description").val("");
            var todo = $("#toDo_list").html();
            localStorage.setItem('todos', todo);
        }
    },
    clear : function() {
        window.localStorage.clear();
        location.reload();
        return false;
    },
    fetchTodo :function() {
        if (localStorage.getItem('todos')) {
            $('#toDo_list').html(localStorage.getItem('todos'));
        }
    }
};

var Obj = new todo();

$(document).ready(function () {
    Obj.fetchTodo();
    $("#add").click(function() {
        Obj.add();
    });
    $("#clear").click(function() {
        Obj.clear();
    });
});