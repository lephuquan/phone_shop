var currentProduct = {};

var loadData = function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  $.ajax({
    url: "product/" + id,
    success: function (result) {
      // use id to return a object
      var getCategoryId = result.categoryDetail.category.id;
      console.log("check product detail--------------->",result.categoryDetail.category.id);
      currentProduct = result;
      $("#product_title").text(result.name);
      showPrice(result);
      showParameter(result.parameter);
      showInfoDetail(result.detail);
      showPhoto(result.productphotoList);
      showDesciption(result.description);
      showCategoryLink(result);
      handleForVariants(result.variantList);
      getReviewList(id);
      saveWatchedProduct();
      loadSimilarProduct(result.categoryDetail.category.id);// gọi vào ham này để lấy categoryId
    },
  });
};


var loadSimilarProduct = function (categoryId) {
  $.ajax({
    url: "product/similarProduct/" + categoryId,
    success: function (result) {
      console.log("get getCategoryId sucess--------------------------<", categoryId);
      console.log('similar--------------->',result);
        showSimilarProduct(result);
    },
  });
};


var showSimilarProduct = function (similarProduct) {

  var index = 0;
  for (var item of similarProduct) {
    var $productItem = $(".product-item:eq(0)").clone();
    $productItem
      .find(".link-product")
      .attr("href", "product-detail?id=" + item.id);
    var mainPhoto = getMainPhoto(item);
    var hoverPhoto = getHoverPhoto(item);
    $productItem.find(".link-product img:eq(0)").attr("src", mainPhoto);
    $productItem.find(".link-product img:eq(1)").attr("src", hoverPhoto);
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
      $("#phone-product").html("");
    }
    $productItem.show();
    $("#phone-product").append($productItem);
    index++;
  }
};

var getMainPhoto = function (product) {
  for (var item of product.productphotoList) {
    if (item.isDefault) {
      return item.photo;
    }
  }
  return "";
};

var getHoverPhoto = function (product) {
  for (var item of product.productphotoList) {
    if (!item.isDefault) {
      return item.photo;
    }
  }
  return "";
};


var showPrice = function (product) {
  if (product.promotion) {
    $("#promotion_label").show();
    $("#product_price").show();
    $("#product_price").html(formatNumber(product.price) + '&nbsp;<span class="woocommerce-Price-currencySymbol">&#8363;</span>');
//    $("# woocommerce-Price-currencySymbol").html("&#8363;"); //!!
    $("#real_price").html(formatNumber(product.promotion.price) + '&nbsp;<span class="woocommerce-Price-currencySymbol">&#8363;</span>');
    $("#real_price").data("price", product.promotion.price);
  } else {
    $("#promotion_label").hide();
    $("#product_price").hide();
    $("#real_price").html(formatNumber(product.price) + '&nbsp;<span class="woocommerce-Price-currencySymbol">&#8363;</span>');

    $("#real_price").data("price", product.price);
  }
};

var showParameter = function (parameter) {
  var array = parameter.split("\n");
  var html = "";
  for (var item of array) {
    html += '<tr><td width="283">' + item + "</td></tr>";
  }
  $("#tbl_parameter tbody").html(html);
};

var showInfoDetail = function (detail) {
  var array = detail.split("\n");
  var html = "";
  for (var item of array) {
    if (!item.trim()) {
      // if item don't have whitespace
      continue;
    }
    var itemArray = item.trim().split("\t"); // item delete whitespace and  split to array by tab
    html +=
      " <tr><td>" +
      itemArray[0] +
      '</td><td class="last">' +
      itemArray[1] +
      "</td></tr>";
  }
  $("#tbl_detail tbody").html(html);
};

var showPhoto = function (photoList) {
  var index = 1;
  for (var item of photoList) {
    // browse all photo of a a product
    if (item.default) {
      // if item is a default photo is add that picture to attributes has nominated id
      $("#main_photo").attr("data-thumb", item.photo);
      $("#main_photo a").attr("href", item.photo);
      $("#main_photo img").attr("data-large_image", item.photo);
      $("#main_photo img").attr("data-src", item.photo);
      $("#main_photo img").attr("src", item.photo);
      $(".is-nav-selected img").attr("src", item.photo);
    } else {
      $("#photo_" + index).attr("src", item.photo);
      $("#photo_" + index).attr("srcset", item.photo);
      $("#slide_" + index).attr("data-thumb", item.photo);
      $("#slide_" + index + " a").attr("href", item.photo);
      $("#slide_" + index + " img").attr("data-large_image", item.photo);
      $("#slide_" + index + " img").attr("data-src", item.photo);
      $("#slide_" + index + " img").attr("src", item.photo);
      $("#slide_" + index + " img").attr("srcset", item.photo);
      index++;
    }
  }

  if(index < 4) {
    for(var i = index; i <= 4; i++) {
        $('#photo_' + i).parent().parent().hide();
    }
  }
};

var showDesciption = function (description) {
  $("#information-detail").html(description);
};

var showCategoryLink = function (product) {
  $("#nav_product a:eq(1)").text(product.categoryDetail.category.name);
  $("#nav_product a:eq(1)").attr(
    "href",
    "category/" + product.categoryDetail.category.id
  );
  $("#nav_product a:eq(2)").text(product.categoryDetail.name);
  $("#nav_product a:eq(2)").attr(
    "href",
    "category-detail/" + product.categoryDetail.id
  );
};

var handleForVariants = function (variantList) {
  if (variantList.length == 0) {
    $(".variations_form").remove();
    return;
  }
  var html = '<option value="">Chọn một tùy chọn</option>';
  for (var item of variantList) {
    html +=
      '<option value="' +
      item.id +
      '" data-price="' +
      item.price +
      '">' +
      item.name +
      "</option>";
  }
  $("#cbo_variant").html(html);
  $("#add_cart").addClass("disabled");
  $("#cbo_variant").change(function () {
    changeVariant($(this).val(), $(this).find("option:selected").data("price"));
  });
};

var changeVariant = function (variantId, price) {
  if (variantId) {
    $("#add_cart").removeClass("disabled");
    $("#product_price").text(formatNumber(parseFloat(price)));
    var currentVariant = currentProduct.variantList.filter(
      (item) => item.id == variantId
    )[0];
    showPrice(currentVariant);
  } else {
    $("#add_cart").addClass("disabled");
  }
};

var getReviewList = function (productId) {
  $.ajax({
    url: "review/" + productId,
    success: function (result) {
      showReviewList(result);
    },
  });
};

var showReviewList = function (reviewList) {
  var index = 0;
  for (var item of reviewList) {
    var $reviewItem = $(".review-item:eq(0)").clone();
    $reviewItem.find(".woocommerce-review__author").text(item.name);
    $reviewItem
      .find(".woocommerce-review__published-date")
      .text(item.createdDate.substring(0, 10));
    $reviewItem.find(".description").text(item.description);
    $reviewItem
      .find(".score-rating")
      .attr("style", "width:" + item.score * 20 + "%");
    if (index == 0) {
      $(".commentlist").html("");
    }
    $reviewItem.show();
    $(".commentlist").append($reviewItem);
    index++;
  }
  $("#comments h3").html(
    reviewList.length + " đánh giá cho <span>" + currentProduct.name + "</span>"
  );
};

var addReview = function () {
  if (
    !$("#rating").val() ||
    !$("#txt_description").val() ||
    !$("#txt_author").val() ||
    !$("#txt_email").val()
  ) {
    alert("Moi ban nhap day du thong tin");
    return;
  }

  var review = {
    score: $("#rating").val(),
    description: $("#txt_description").val(),
    name: $("#txt_author").val(),
    email: $("#txt_email").val(),
    productId: currentProduct.id,
  };
  $.ajax({
    url: "review",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(review),
    success: function (result) {
      if (result) {
        alert("Thêm nhận xét thành công");
        getReviewList(currentProduct.id);
      }
    },
  });
};

var getMainPhoto = function (product) {
  for (var item of product.productphotoList) {
    if (item.isDefault) {
      return item.photo;
    }
  }
  return "";
};

var getHoverPhoto = function (product) {
  for (var item of product.productphotoList) {
    if (!item.isDefault) {
      return item.photo;
    }
  }
  return "";
};

var saveWatchedProduct = function () {
  var watchedProduct = [];
  if (localStorage["watchedProduct"]) {
    watchedProduct = $.parseJSON(localStorage["watchedProduct"]);
  }
  var filter = watchedProduct.filter((item) => item.id == currentProduct.id);
  if (filter.length == 0) {
    var itemProduct = {
      id: currentProduct.id,
      name: currentProduct.name,
      mainPhoto: getMainPhoto(currentProduct),
      hoverPhoto: getHoverPhoto(currentProduct),
      promotion: currentProduct.promotion,
    };
    watchedProduct.push(itemProduct);
    localStorage["watchedProduct"] = JSON.stringify(watchedProduct);
  }
};

//$("#plus_button").click(function () {
//  var currentQuantity = parseInt($("#product_quantity").val());
//  $("#product_quantity").val(parseInt($("#product_quantity").val()) + 1);
//});
//
//$("#minus_button").click(function () {
//  var currentQuantity = parseInt($("#product_quantity").val());
//  if (currentQuantity > 1) {
//    $("#product_quantity").val(currentQuantity - 1);
//  }
//});

$("#add_cart").click(function () {
  if ($(this).hasClass("disabled")) {
    alert("Hãy chọn 1 màu tương ứng");
  } else {
    addToCart();
  }
});

$("#send_comment").click(function () {
  addReview();
});
