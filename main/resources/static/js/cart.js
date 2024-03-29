var productCart = [];

var addToCart = function () {
  if (localStorage["productCart"]) {
    productCart = $.parseJSON(localStorage["productCart"]);
  }
  var variantId = $("#cbo_variant").val();
  var productInCart = productCart.filter(
    (item) => item.id == currentProduct.id && item.variantId == variantId
  );
  if (productInCart.length > 0) {
    updateProductInCart(productInCart[0]);
  } else {
    var quantity = parseInt($("#product_quantity").val());
    if (quantity >= 0 && quantity > 5) {
      currentProduct.quantity = quantity;
    } else {
      alert("Số lượng không hợp lệ!");
      currentProduct.quantity = 0;
    }
    if (variantId) {
      currentProduct.variantId = variantId;
      currentProduct.variantName = $("#cbo_variant option:selected").text();
    }
    currentProduct.price = $("#real_price").data("price");
    productCart.push(currentProduct);
  }
  localStorage["productCart"] = JSON.stringify(productCart);
  showProductInCart();
};

var showProductInCart = function () {
  if (localStorage["productCart"]) {
    productCart = $.parseJSON(localStorage["productCart"]);
  }
  if (productCart.length == 0) {
    $(".mini-cart").hide();
    $(".mini-cart-empty").show();
    $(".cart-icon.image-icon strong").text(0);
    $("#total_price").text(0);
    return;
  }
  $(".mini-cart").show();
  $(".mini-cart-empty").hide();
  var html = "";
  var totalQuantity = 0;
  for (var item of productCart) {
    html +=
      '<li class="woocommerce-mini-cart-item mini_cart_item">' +
      '<a href="#" onclick="removeProductInCart(' +
      item.id +
      "," +
      item.variantId +
      ')" class="remove remove_from_cart_button" aria-label="Xóa sản phẩm này">×</a>' +
      '<a href="product-detail?id=' +
      item.id +
      '">' +
      '    <img width="180" height="180" src="' +
      getMainPhoto(item) +
      '" class="attachment-shop_thumbnail size-shop_thumbnail wp-post-image" alt="" srcset="" sizes="(max-width: 180px) 100vw, 180px">' +
      item.name +
      " - " +
      (item.variantName || "") +
      "&nbsp;" +
      "</a>" +
      '<span class="quantity">' +
      item.quantity +
      ' × <span class="woocommerce-Price-amount amount">' +
      formatNumber(item.price) +
      '&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></span></span>' +
      "</li>";
    totalQuantity += item.quantity;
  }
  $("#cart_List").html(html);
  $(".cart-icon.image-icon strong").text(totalQuantity);
  $("#total_price").text(formatNumber(getTotalMoney()));
  $(".woocommerce-mini-cart__total").html(
    '<strong>Tổng cộng:</strong> <span class="woocommerce-Price-amount amount">' +
      formatNumber(getTotalMoney()) +
      '&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></span>'
  );
  $(".cart-price").html(
    formatNumber(getTotalMoney()) +
      '&nbsp;<span class="woocommerce-Price-currencySymbol">₫</span></span>'
  );
};

var updateProductInCart = function (product) {
  product.quantity += parseInt($("#product_quantity").val());
};

var removeProductInCart = function (productId, variantId) {
  if (localStorage["productCart"]) {
    productCart = $.parseJSON(localStorage["productCart"]);
  }
  for (var index in productCart) {
    if (
      productCart[index].id == productId &&
      (!variantId || productCart[index].variantId == variantId)
    ) {
      productCart.splice(index, 1); // delete
      localStorage["productCart"] = JSON.stringify(productCart);
      showProductInCart();
      showCartList();
      return;
    }
  }
};

var getTotalMoney = function () {
  var total = 0;
  for (var item of productCart) {
    total += item.quantity * item.price;
  }
  return total;
};

var getMainPhoto = function (product) {
  for (var item of product.productphotoList) {
    if (item.isDefault) {
      return item.photo;
    }
  }
  return "";
};

var showCartList = function () {
  var productList = [];
  if (localStorage["productCart"]) {
    productList = $.parseJSON(localStorage["productCart"]);
  }
  var index = 0;
  for (var item of productList) {
    var $productItem = $(".cart-item-data:eq(0)").clone();
    $productItem
      .find(".link-product")
      .attr("href", "product-detail?id=" + item.id);
    var mainPhoto = getMainPhoto(item);
    var hoverPhoto = getHoverPhoto(item);
    $productItem.find(".link-product img:eq(0)").attr("src", mainPhoto);
    //$productItem.find('.link-product img:eq(1)').attr('src', hoverPhoto);
    $productItem.find(".link-product img:eq(0)").attr("srcset", "");
    //$productItem.find('.link-product img:eq(1)').attr('srcset', '');
    $productItem
      .find(".cart-item-price")
      .html(
        formatNumber(item.price) +
          '&nbsp;<span class="woocommerce-Price-currencySymbol">&#8363;</span>'
      );
    $productItem
      .find(".link-product:eq(1)")
      .text(item.name + " - " + (item.variantName || ""));
    $productItem.find(".qty").val(item.quantity);
    $productItem
      .find(".total-price")
      .html(
        formatNumber(item.quantity * item.price) +
          '&nbsp;<span class="woocommerce-Price-currencySymbol">&#8363;</span></span>'
      );
    $productItem.data("productId", item.id);
    $productItem.data("variantId", item.variantId);
    if (index == 0) {
      $("#tbl_cart tbody").html("");
    }
    $productItem.show();
    $("#tbl_cart tbody").append($productItem);
    $productItem.find(".remove").click(function () {
      removeProductInCart(
        parseFloat($productItem.data("productId")),
        parseFloat($productItem.data("variantId"))
      );
    });
    index++;
  }
  if (productList.length == 0) {
    $("#tbl_cart tbody").html("");
  }
  $(".cart-price").html(
    formatNumber(getTotalMoney()) +
      '&nbsp;<span class="woocommerce-Price-currencySymbol">&#8363;</span></span>'
  );
};

showProductInCart();
showCartList();
