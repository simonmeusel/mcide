var config;
var oldConfig;

$(window).ready(function() {
  $.ajax({
    url: "https://raw.githubusercontent.com/simonmeusel/mcide-plugin/master/config.yml",
    success: function(data) {
      config = jsyaml.load(data);
      oldConfig = jsyaml.load(data);

      $("#generate").addClass("btn-info");
      $("#generate").removeClass("btn-warning disabled");
      $("#generate").text("Generate your config file!");
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error("Error loading config file");
      console.error(jqXHR);
      console.error(textStatus);
      console.error(errorThrown);
      $("#generate").addClass("btn-danger");
      $("#generate").removeClass("btn-warning");
      $("#generate").text("Error loading config file. Give the site a refresh!");
    }
  });
});

$("#toggle-password-show").click(function() {
  $("#toggle-password-show > span").toggleClass("glyphicon-eye-close");
  $("#toggle-password-show > span").toggleClass("glyphicon-eye-open");

  if ($("#password").attr("type") === "password") {
    $("#password").attr("type", "text");
  } else {
    $("#password").attr("type", "password");
  }
});

$("#toggle-keystore-password-show").click(function() {
  $("#toggle-keystore-password-show > span").toggleClass("glyphicon-eye-close");
  $("#toggle-keystore-password-show > span").toggleClass("glyphicon-eye-open");

  if ($("#keystore-password").attr("type") === "password") {
    $("#keystore-password").attr("type", "text");
  } else {
    $("#keystore-password").attr("type", "password");
  }
});

$("#generate-password").click(function() {
  var password = "";
  var length = 16;
  var passwordSource = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  for (var i = 0; i < length; ++i) {
    password += passwordSource.charAt(Math.floor((passwordSource.length + 1) * Math.random()));
  }
  $("#password").val(password);
});

$("#generate").click(function() {
  if ($("#password").val() === "") {
    alert("Choose a password first!");
    return;
  }

  config.password = $("#password").val();
  config.allowSSL = $("li").has("a[href='#ssl']").hasClass("active");
  config.allowNoSSL = $("li").has("a[href='#nossl']").hasClass("active");

  var hasCert = $("li").has("a[href='#have']").hasClass("active");
  var autogenerate = $("li").has("a[href='#auto-generate']").hasClass("active");

  config.keystore.autogenerate = config.allowSSL && !hasCert && autogenerate;

  if (hasCert) {
    config.keystore.password = $("#keystore-password").val();
  }

  $("#output").val(jsyaml.dump(config));
  $("#output").removeClass("hidden");

  config = oldConfig;
});
