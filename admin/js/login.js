$(function() {
  //添加登录按钮的点击事件
  $(".input_sub").on("click", function(e) {
    //修改submit按钮的默认设置
    e.preventDefault();
    //获取用户名和密码
    var userName = $(".input_txt")
      .val()
      .trim();
    var userPwd = $(".input_pass")
      .val()
      .trim();

    //判断用户名密码为空情况
    if (userName == "" || userPwd == "") {
      //用modal方法控制弹出模态框
      $("#myModal").modal();
      $(".modal-body").html("请输入用户名或密码");
      return;
    }
    //发送一个Ajax请求
    $.ajax({
      type: "post",
      url: "http://localhost:8080/api/v1/admin/user/login",
      data: {
        username: userName,
        password: userPwd
      },
      success: function(res) {
        //获取返回结果中的msg属性来渲染模态框文本内容
        $(".modal-body").html(res.msg);
        $("#myModal").modal();
        //if判断用户名和密码是否正确，正确的话res.code值为200
        if (res.code == 200) {
          //登录成功则将令牌token存储到本地存储上，这样方便以后事件请求时可以直接取出进行判断是否登录成功
          window.localStorage.setItem("token", res.token);
          // $(".modal-body").text("登录成功");
          $("#myModal").on("hidden.bs.modal", function(e) {
            window.location.href = "./index.html";
          });
        }
      }
    });
  });
});
