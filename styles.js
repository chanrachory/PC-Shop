$(document).ready(function () {
  // ---------------------
  // Countdown Timer
  // ---------------------
  let time = 12 * 3600 + 34 * 60 + 56; // 12:34:56 in seconds

  let timerInterval = setInterval(function () {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;

    $("#timer").text(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    );

    time--;
    if (time < 0) {
      clearInterval(timerInterval); // 🛑 Stop timer
      $("#timer").text("00:00:00");
      alert("🕒 Time’s up!");
    }
  }, 1000);

  // ---------------------
  // Cart Functionality
  // ---------------------
  let cart = [];
  let cartCount = 0;

  // Add to Cart
  $(".add-to-cart").click(function () {
    let name = $(this).data("name");
    let price = parseFloat($(this).data("price"));

    if (!name || isNaN(price)) {
      alert("ទិន្នន័យវត្ថុមិនត្រឹមត្រូវ!");
      return;
    }

    let existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name: name, price: price, quantity: 1 });
    }

    // Count all quantities
    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    $("#cart-count").text(cartCount);
    // New ✨: Animation effect
    let cartIcon = $("#cart-count");
    cartIcon.addClass("cart-bounce");
    setTimeout(() => cartIcon.removeClass("cart-bounce"), 600);
    updateCartDisplay();
  });

  // Update Cart Display in Modal
  function updateCartDisplay() {
    let cartItems = $("#cart-items");
    cartItems.empty();

    if (cart.length === 0) {
      $("#cart-empty").show();
    } else {
      $("#cart-empty").hide();
      cart.forEach((item) => {
        let total = (item.price * item.quantity).toFixed(2);
        cartItems.append(`
            <div class="cart-item d-flex justify-content-between align-items-center mb-2">
                <div>
                    <h6>${item.name}</h6>
                    <p>$${item.price} x ${item.quantity} = $${total}</p>
                </div>
                <div>
                    <button class="btn btn-sm btn-danger remove-item" data-name="${item.name}">Remove</button>
                </div>
            </div>
          `);
      });
    }

    // Remove item from cart
    $(".remove-item").click(function () {
      let name = $(this).data("name");
      cart = cart.filter((item) => item.name !== name);
      cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      $("#cart-count").text(cartCount);
      updateCartDisplay();
    });
  }
  
  // Checkout Print Functionality
  $("#checkout-btn").click(function () {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    let receiptItems = $("#receipt-items");
    receiptItems.empty();
    let total = 0;

    cart.forEach((item) => {
      let itemTotal = (item.price * item.quantity).toFixed(2);
      total += parseFloat(itemTotal);
      receiptItems.append(`
          <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price}</td>
              <td>$${itemTotal}</td>
          </tr>
        `);
    });

    $("#receipt-total").text(total.toFixed(2));
    $("#receipt-date").text(new Date().toLocaleString());

    $("body > *:not(#print-receipt)").addClass("no-print");
    window.print();
    $("body > *:not(#print-receipt)").removeClass("no-print");

    // Clear cart after checkout
    cart = [];
    cartCount = 0;
    $("#cart-count").text(cartCount);
    updateCartDisplay();
    $("#cartModal").modal("hide");
  });
});
