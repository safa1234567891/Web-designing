// Fuel prices (can be updated from backend)
const fuelPrices = {
    petrol: 96.72,
    diesel: 89.62,
    cng: 66.00
};

// DOM Elements
const fuelTypeSelect = document.getElementById('fuel-type');
const quantityInput = document.getElementById('quantity');
const pricePerLiterInput = document.getElementById('price-per-liter');
const subtotalInput = document.getElementById('subtotal');
const gstInput = document.getElementById('gst');
const discountInput = document.getElementById('discount');
const totalInput = document.getElementById('total');
const calculateBtn = document.getElementById('calculate-btn');
const printBtn = document.getElementById('print-btn');
const clearBtn = document.getElementById('clear-btn');
const paymentButtons = document.querySelectorAll('.payment-btn');
const currentTimeSpan = document.getElementById('current-time');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    setupEventListeners();
});

// Update current time
function updateCurrentTime() {
    const now = new Date();
    currentTimeSpan.textContent = now.toLocaleString();
}

// Setup event listeners
function setupEventListeners() {
    fuelTypeSelect.addEventListener('change', updatePricePerLiter);
    quantityInput.addEventListener('input', validateQuantity);
    discountInput.addEventListener('input', validateDiscount);
    calculateBtn.addEventListener('click', calculateTotal);
    printBtn.addEventListener('click', printReceipt);
    clearBtn.addEventListener('click', clearForm);
    paymentButtons.forEach(btn => {
        btn.addEventListener('click', () => selectPaymentMethod(btn));
    });
}

// Update price per liter based on fuel type
function updatePricePerLiter() {
    const selectedFuel = fuelTypeSelect.value;
    if (selectedFuel && fuelPrices[selectedFuel]) {
        pricePerLiterInput.value = fuelPrices[selectedFuel].toFixed(2);
    } else {
        pricePerLiterInput.value = '';
    }
}

// Validate quantity input
function validateQuantity() {
    const quantity = parseFloat(quantityInput.value);
    if (quantity < 0) {
        showError(quantityInput, 'Quantity cannot be negative');
        return false;
    }
    if (quantity > 1000) {
        showError(quantityInput, 'Maximum quantity is 1000 liters');
        return false;
    }
    clearError(quantityInput);
    return true;
}

// Validate discount input
function validateDiscount() {
    const discount = parseFloat(discountInput.value);
    if (discount < 0) {
        showError(discountInput, 'Discount cannot be negative');
        return false;
    }
    clearError(discountInput);
    return true;
}

// Calculate total amount
function calculateTotal() {
    if (!validateQuantity() || !validateDiscount()) {
        return;
    }

    const quantity = parseFloat(quantityInput.value) || 0;
    const pricePerLiter = parseFloat(pricePerLiterInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;

    const subtotal = quantity * pricePerLiter;
    const gst = subtotal * 0.18; // 18% GST
    const total = subtotal + gst - discount;

    subtotalInput.value = subtotal.toFixed(2);
    gstInput.value = gst.toFixed(2);
    totalInput.value = total.toFixed(2);

    // Enable print button if total is greater than 0
    printBtn.disabled = total <= 0;
}

// Select payment method
function selectPaymentMethod(button) {
    paymentButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

// Print receipt
function printReceipt() {
    const receipt = document.getElementById('receipt-template').cloneNode(true);
    receipt.style.display = 'block';

    // Fill receipt details
    const now = new Date();
    receipt.querySelector('#receipt-date').textContent = now.toLocaleDateString();
    receipt.querySelector('#receipt-time').textContent = now.toLocaleTimeString();
    receipt.querySelector('#receipt-id').textContent = generateTransactionId();

    // Add items to receipt
    const itemsDiv = receipt.querySelector('#receipt-items');
    itemsDiv.innerHTML = `
        <p>Fuel Type: ${fuelTypeSelect.options[fuelTypeSelect.selectedIndex].text}</p>
        <p>Quantity: ${quantityInput.value} liters</p>
        <p>Price per liter: ₹${pricePerLiterInput.value}</p>
        <p>Subtotal: ₹${subtotalInput.value}</p>
        <p>GST (18%): ₹${gstInput.value}</p>
        <p>Discount: ₹${discountInput.value}</p>
    `;

    // Add total
    receipt.querySelector('#receipt-total').innerHTML = `
        <p><strong>Total Amount: ₹${totalInput.value}</strong></p>
    `;

    // Print receipt
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Fuel Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .receipt { max-width: 300px; margin: 20px auto; }
                    .receipt-header { text-align: center; }
                    .receipt-body { margin: 20px 0; }
                    .receipt-footer { text-align: center; margin-top: 20px; }
                    hr { border: 1px dashed #ccc; }
                </style>
            </head>
            <body>
                ${receipt.outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Generate transaction ID
function generateTransactionId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXN${timestamp}${random}`;
}

// Clear form
function clearForm() {
    fuelTypeSelect.value = '';
    quantityInput.value = '';
    pricePerLiterInput.value = '';
    subtotalInput.value = '';
    gstInput.value = '';
    discountInput.value = '0';
    totalInput.value = '';
    printBtn.disabled = true;
    paymentButtons.forEach(btn => btn.classList.remove('selected'));
    clearErrors();
}

// Show error message
function showError(input, message) {
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

// Clear error message
function clearError(input) {
    input.classList.remove('error');
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.error').forEach(element => {
        element.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(element => {
        element.remove();
    });
} 