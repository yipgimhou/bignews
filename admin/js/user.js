$(function() {
  var OldUrm;
  var OldPwd;
  $.get({
    url: "http://localhost:8080/api/v1/admin/user/detail",
    success: function(res) {
      if (res.code == 200) {
        //用for in 遍历一遍res.data中的属性
        for (var key in res.data) {
          //每次遍历把res.data中的值放入对应的input标签的value中
          $("input." + key).val(res.data[key]);
        }
        //图片信息单独修改
        $(".user_pic").attr("src", res.data.userPic);
        //将获取到的管理员账号和密码放到全局变量OldUrm和OldPwd，用来后面修改时进行判断
        OldUrm = $("input.username").val();
        OldPwd = $("input.password").val();
      }
    }
  });
  //change事件获取图片上传信息
  $("#exampleInputFile").on("change", function() {
    //获取files[0]中的图片信息
    var newImg = this.files[0];
    //将图片信息转化为url地址
    var url = URL.createObjectURL(newImg);
    // 将url地址渲染到img标签上
    $(".user_pic").attr("src", url);
  });

  //点击修改按钮实现修改功能
  $("button.btn-edit").on("click", function(e) {
    //清除submit默认设置
    e.preventDefault();
    //获取表单的全部信息并转化为二进制
    var form = $("#form")[0];
    var formData = new FormData(form);

    //将转化为二进制的表单信息post发送到服务器上
    $.post({
      url: "http://localhost:8080/api/v1/admin/user/edit",
      //清除请求头
      contentType: false,
      processData: false,
      data: formData,
      success: function(res) {
        if (res.code == 200) {
          //post成功后，将新的数据再次渲染在子页面和父页面中
          //再次发起一次跟index页面中一样的get请求
          console.log(res);
          $.ajax({
            type: "get",
            url: "http://localhost:8080/api/v1/admin/user/info",
            headers: {
              //设置请求头，用来装载管理员登录成功后获得的本地存储令牌
              Authorization: localStorage.getItem("token")
            },
            success: function(res) {
              //通过parent来获取父页面的元素
              parent.$(".user_info>img").attr("src", res.data.userPic);
              parent
                .$(".user_info>span")
                .html("欢迎&nbsp;&nbsp" + res.data.nickname);
              parent.$(".user_center_link>img").attr("src", res.data.userPic);
              //刷新子页面信息
              window.location.reload();
              if (
                res.data.password !== OldPwd ||
                res.data.username !== OldUrm
              ) {
                alert("修改成功，请重新登录");
                //删除token
                window.localStorage.removeItem("token");
                //回到登录页面
                parent.window.location.href = "./login.html";
              }
            }
          });
        }
      }
    });
  });
});
