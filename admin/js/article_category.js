$(function() {
  //调用函数发起get请求
  getData();
  //将get请求封装为一个函数，用来充当刷新页面功能
  function getData() {
    $.get({
      url: "http://localhost:8080/api/v1/admin/category/list",
      success: function(res) {
        if (res.code == 200) {
          var htmlStr = template("list", res);
          $("tbody").html(htmlStr);
        }
      }
    });
  }
  //利用bootstr中介绍的data属性的方式，来控制被指向的模态框
  //show.bs.modal表示直接触发模态框
  $("#myModal").on("show.bs.modal", function(e) {
    //可以通过show.bs.modal事件中的relatedTarget属性来访问该触发事件的元素
    if (e.relatedTarget == $("#xinzengfenlei")[0]) {
      //设置模态框中的样式
      $("#exampleModalLabel").text("新增文章分类名");
      $("#btn-confirm").addClass("btn-success");
      $("#btn-confirm").text("新增");
      //清空模态框中输入框和文本域中的内容
      $(".modal-body form")[0].reset();
      //点击模态框中的新增按钮
      $("#btn-confirm").on("click", function() {
        //获取到输入框和文本域中的内容，作为post事件的data
        var name = $("#recipient-name").val();
        var slug = $("#message-text").val();
        //向服务器发起post请求，新增内容
        $.post({
          url: "http://localhost:8080/api/v1/admin/category/add",
          data: {
            name: name,
            slug: slug
          },
          success: function(res) {
            if (res.code == 201) {
              //用.modal方法隐藏模态框
              $("#myModal").modal("hide");
              //调用函数刷新页面
              getData();
            }
          }
        });
      });
    } else {
      //点击触发编辑按钮事件弹出编辑模态框
      //设置编辑模态框样式
      $("#exampleModalLabel").text("编辑文章分类名");
      $("#btn-confirm").text("编辑");
      //通过relatedTarget属性访问到触发模态框的元素，并取其中data-id类中的值，作为发送get请求的data
      var id = $(e.relatedTarget).attr("data-id");
      //发送get请求，获取到该id下的name和slug中的值
      $.get({
        url: "http://localhost:8080/api/v1/admin/category/search",
        data: {
          id: id
        },
        success: function(res) {
          if (res.code == 200) {
            //将id渲染在模态框的隐藏域中，将name和slug分别渲染在输入框和文本域中，作为编辑模态框中的默认值
            $("#cateID").val(res.data[0].id);
            $("#recipient-name").val(res.data[0].name);
            $("#message-text").val(res.data[0].slug);
          }
        }
      });
      //点击模态框中的编辑按钮进行内容编辑
      $("#btn-confirm").on("click", function() {
        //获取模态框的隐藏域、输入框和文本域中的内容，作为post请求的的data
        var id = $("#cateID").val();
        var name = $("#recipient-name").val();
        var slug = $("#message-text").val();
        //发起post请求，上传编辑后的数据到服务器上
        $.post({
          url: "http://localhost:8080/api/v1/admin/category/edit",
          data: {
            id: id,
            name: name,
            slug: slug
          },
          success: function(res) {
            if (res.code == 200) {
              //关闭模态框
              $("#myModal").modal("hide");
              //调用函数刷新页面
              getData();
            }
          }
        });
      });
    }
  });
  //通过事件委托来选中删除按钮触发的事件
  $("tbody").on("click", ".btn-danger", function() {
    //弹出选择框，管理员确认是否删除数据，确定为true,取消为false
    var choose = confirm("确认要删除吗？");
    //获取到该触发元素中的id值，作为post请求删除内容的data值
    var id = $(this).attr("data-id");
    //判断管理员在选择框中选择的按钮是true还是false
    if (choose) {
      //管理员选择true，确认要删除该数据，发送post请求到服务器上处理数据
      $.post({
        url: "http://localhost:8080/api/v1/admin/category/delete",
        data: {
          id: id
        },
        success: function(res) {
          //成功则数据已删除，调用函数刷新页面
          getData();
        }
      });
    }
  });
});
