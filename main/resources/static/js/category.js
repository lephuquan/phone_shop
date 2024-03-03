$("#filter_price").click(function () {
  filterPrice();
});

//$("#search_form button").click(function () {// building... tại sao nó không chạy vào ajax
//    var keywork = $("#search_form input[type='text']").val();
//    console.log("test search", keyword);
////$.ajax({
////    url: "product/search",
////    type: "POST",
////    contentType: "application/json",
////    data: keyword,
////    success: function (result) {
//////      showSearchProduct(result);
////        console.log("oki");
////    },
////  });
//////  if ($("#search_form input[type='text']").val() != "") {// save...
//////    location.href =
//////      "category?keyword=" + $("#search_form input[type='text']").val();
//////  }
//});

var getCategory = function () {
  $.ajax({
    url: "category-data",
    success: function (result) {
      // go to category-date to get data from model
      console.log(result);
      showCategory(result);
      showCategoryLeft(result);
    },
  });
};

var loadAccessories = function () {
  $.ajax({
    url: "product/similarProduct/6",
    success: function (result) {
      console.log("check loadAccessories",result);
      var index = 0;
         for (var item of result) {
                var mainPhoto = getMainPhoto(item);
               var $accessoriesItem = $(".accessories-item:eq(0)").clone();
                $accessoriesItem.find("a").attr("href", "product-detail?id="+ item.id);
               $accessoriesItem.find("img").attr("src", mainPhoto);
               $accessoriesItem.find("img").attr("srcset", mainPhoto);
               $accessoriesItem
                     .find(".woocommerce-Price-amount")
                     .html(
                       formatNumber(item.price) +
                         '&nbsp;<span class="woocommerce-Price-currencySymbol">&#8363;</span>'
                     );
               $accessoriesItem.find(".woocommerce-Price-amount").data("price", item.price);
               if (index == 0) {
                 $("#show-accessories-item").html("");
               }
               $accessoriesItem.show();
               $("#show-accessories-item").append($accessoriesItem);
               index++;
               if(index == 5){
                break;
               }
         }
    },
  });
};


var showCategory = function (categoryList) {
  var html = "";
  for (var item of categoryList) {
    html +=
      '<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat  menu-item-446"' +
      'id="menu-item-446">' +
      '<a class="menu-image-title-after menu-image-not-hovered nav-top-link" ' +
      'href="category?id=' +
      item.id +
      '"><img alt="" ' +
      'class="menu-image menu-image-title-after" ' +
      'height="24" ' +
      'sizes="(max-width: 24px) 100vw, 24px" ' +
      'src="' +
      item.photo +
      '" srcset="" ' +
      'width="24"/><span class="menu-image-title">' +
      item.name +
      "</span></a></li>";
  }
  $("#ul_category").html(html);
};

// must at category page and then export data
var getProductByCategory = function (sort) {
  // tham sô trả về
  var params = new URLSearchParams(window.location.search); // biến param này dùng để lấy biến paramater từ href hay gì đó tương tự/ ko chắc chính xác
  var id = params.get("id"); // tìm chỗ nào có ?id và lấy giá trị của nó
  var keyword = params.get("keyword");
  if(keyword) {
    searchProduct(keyword);
    return;
  }
  var url = "product?category-id=" + id;
  if (sort) {
    url += "&sort=" + sort;
  }
  $.ajax({
    url: url,
    success: function (result) {
      console.log(result);
      showProduct(result);
    },
  });
};
var searchProduct = function (keyword) {
  $.ajax({
    url: "product/searchProduct",
    type: "POST",
    contentType: 'application/json',
    data: keyword,
    success: function (result) {
      console.log(result);
      showProduct(result);
    },
  });
};

var showProduct = function (productList) {
  var index = 0;
  var countProduct = productList.length;
  console.log("length----------> ", productList);
  $(".woocommerce-result-count").text("Xem tất cả "+ countProduct +" kết quả")
  for (var item of productList) {
    var $productItem = $(".product-item:eq(0)").clone();
    $productItem
      .find(".link-product")
      .attr("href", "product-detail?id=" + item.id);
    var mainPhoto = getMainPhotos(item);
    var hoverPhoto = getHoverPhoto(item);
    $productItem.find(".link-product img:eq(0)").attr("src", mainPhoto); // changg infornation
    $productItem.find(".link-product img:eq(1)").attr("src", hoverPhoto);
    console.log("mainPhoto", mainPhoto);
    console.log("hvPhoto", hoverPhoto);
    $productItem.find(".link-product img:eq(0)").attr("srcset", "");
    $productItem.find(".link-product img:eq(1)").attr("srcset", "");
    $productItem
      .find(".woocommerce-Price-amount")
      .html(
        formatNumber(item.price) +
          '&nbsp;<span class="woocommerce-Price-currencySymbol">&#8363;</span>'
      );
    $productItem.find(".woocommerce-Price-amount").data("price", item.price);
    $productItem.find(".link-product:eq(1)").text(item.name);
    if (index == 0) {
      $("#div_product").html("");
    }
    $productItem.show();
    $("#div_product").append($productItem);
    index++;
  }
};

 var getMainPhotos = function (product) {
    for (var item of product.productphotoList) {
      if (item.isDefault) {
        return item.photo;
      }
    }
    return "";
  };
  //getMainPhoto
  //getHoverPhoto
  var getHoverPhoto = function (product) {
    for (var item of product.productphotoList) {
      if (!item.isDefault) {
        return item.photo;
      }
    }
    return "";
  };



var showCategoryLeft = function (categoryList) {
  var html = "";
   var params = new URLSearchParams(window.location.search);
  var idParam = params.get("id");

  for (var item of categoryList) {
    var focusClass = "";
    if (item.id == parseInt(idParam)) {
      focusClass = "current-menu-item";
    }
    html +=
      '<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-446 ' +
      focusClass +
      '">' +
      '<a href="category?id=' +
      item.id +
      '" data-id="' +
      item.id +
      '" class="menu-image-title-after menu-image-not-hovered">' +
      '<img width="24" height="24" src="' +
      item.photo +
      '" class="menu-image menu-image-title-after" alt="" srcset="" sizes="(max-width: 24px) 100vw, 24px" />' +
      '<span class="menu-image-title">' +
      item.name +
      "</span></a></li>";
  }
  $("#main_menu").html(html);
};

var filterPrice = function () {
  var maxPrice = parseFloat($("#max_price").val());
  var minPrice = parseFloat($("#min_price").val());

  $(".product-item").each(function () {
    var price = $(this).find(".woocommerce-Price-amount").data("price");
    if (price >= minPrice && price <= maxPrice) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
};

$(".header-nav .cart-item").hover(
  function () {
    $(this).addClass("current-dropdown");
  },
  function () {
    $(this).removeClass("current-dropdown");
  }
);
