$(function() {
  //进入页面便直接发起get请求，获取数据进行页面渲染
  $.ajax({
    type: "get",
    url: "http://localhost:8080/api/v1/admin/user/info",
    //设置请求头，用来存放本地存储中登录成功后的令牌token
    headers: {
      Authorization: localStorage.getItem("token")
    },
    success: function(res) {
      //进行管理员昵称和头像元素的渲染
      $(".user_info>img").attr("src", res.data.userPic);
      $(".user_info>span").html("欢迎&nbsp;&nbsp" + res.data.nickname);
      $(".user_center_link>img").attr("src", res.data.userPic);
    }
  });
  //点击安全退出按钮进行退出操作，删除本地存储的token，并跳转到登录页面
  $(".logout").on("click", function() {
    //删除token
    window.localStorage.removeItem("token");
    //回到登录页面
    window.location.href = "./login.html";
  });
  //设置左侧导航中各项的CSS样式，选中效果
  $("div.level01").on("click", function() {
    //设置排他效果
    $(this)
      .addClass("active")
      .siblings("div")
      .removeClass("active");
    //第二栏文章管理中有下拉列表，做出判断语句
    if ($(this).index() == 1) {
      //给下拉列表显示与隐藏设置一个开关
      $("ul.level02").toggle();
      //jQuery对象不能这样去触发a标签的默认的跳转事件，只有a标签的原生DOM对象才会在点击的时候触发a标签的默认的跳转行为
      $("ul.level02 li:eq(0)>a")[0].click();
      $(this)
        .find("b")
        .toggleClass("rotate0");
    }
  });
  //设置下拉列表中的排他效果
  $("div.level02 li").on("click", function() {
    $(this)
      .addClass("active")
      .siblings("li")
      .removeClass("active");
  });
});
