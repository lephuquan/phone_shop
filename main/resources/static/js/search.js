var data = [];
$("#search_form input[type='text']").keyup(function (e) {
  console.log($(this).val());
  if (e.keyCode == 13) {
    location.href = data[0].link;
  } else {
    searchData($(this).val());// search data được sử dụng lại ở đây nên sẽ không ăn đước hàm show searchProdcut
  }
});

var searchKeyword = "";
$("#search_form button").click(function () {// building... tại sao nó không chạy vào ajax
    searchKeyword = $("#search_form input[type='text']").val();
    console.log("wait...");
    if (searchKeyword != "") {// chưa valid dấu cách, kí tự
        location.href =
          "category?keyword=" + searchKeyword;
      }
});

var loadClickButtonSearch = function(){
     var params = new URLSearchParams(window.location.search);
             var keywordParam = params.get("keyword");
             console.log("tesssssssst function", keywordParam);
     $.ajax({
         url: "product/search",
         type: "POST",
         contentType: "application/json",
         data: keywordParam,
         success: function (result) {
           showSearchProduct(result);
             console.log("oki", result);
         },
       });
     //
}


var searchData = function (keyword) {
  $.ajax({
    url: "product/search",
    type: "POST",
    contentType: "application/json",
    data: keyword,
    success: function (result) {
      data = result;
      console.log("check search------------->", result);
      showSearch(result);
    },
  });
};

var showSearch = function (productList) {
  var index = 0;
  for (var item of productList) {
    var $searchItem = $(".search-item:eq(0)").clone();
    var mainPhoto = getMainPhotos(item);
    var hoverPhoto = getHoverPhoto(item);
    $searchItem.attr("href","product-detail?id=" + item.id);
    $searchItem.find(".search-image").attr("src",  mainPhoto);
    $searchItem.find(".search-name").text(item.name);
    $searchItem
      .find(".search-price")
      .html(
        '<span class="woocommerce-Price-amount amount">' +
          formatNumber(item.price) +
          '&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></span>'
      );

    if (index == 0) {
      $("#div_search").html("");
    }
    $searchItem.show();
    $("#div_search").append($searchItem);
    index++;
  }
};

var showSearchProduct = function (searchPruduct) {// chưa bắt nút search
console.log('check button search',searchPruduct);
 var index = 0;
   var countProduct = searchPruduct.length;
   console.log("length---------->new", countProduct);
   $(".woocommerce-result-count").text("Xem tất cả "+ countProduct +" kết quả");
    $(".woocommerce-ordering").hide();
   for (var item of searchPruduct) {
     var $productItem = $(".product-item:eq(0)").clone();
     $productItem
       .find(".link-product")
       .attr("href", "product-detail?id=" + item.id);
     var mainPhoto = getMainPhotos(item);
     var hoverPhoto = getHoverPhoto(item);
     $productItem.find(".link-product img:eq(0)").attr("src", mainPhoto);
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