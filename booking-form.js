/**
 * BookingForm - Multi-step booking form handler
 * Manages form submission and backend integration for event bookings
 */

class BookingForm {
  constructor() {
    this.currentStep = 1;
    this.formData = {
      eventType: "",
      date: "",
      location: "",
      guestCount: "",
      budget: "",
      requirements: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.displayStep(1);
  }

  setupEventListeners() {
    const nextBtns = document.querySelectorAll(".next-step-btn");
    const prevBtns = document.querySelectorAll(".prev-step-btn");
    const submitBtn = document.querySelector(".submit-booking-btn");

    nextBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.nextStep());
    });

    prevBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.prevStep());
    });

    if (submitBtn) {
      submitBtn.addEventListener("click", () => this.submitForm());
    }

    document.querySelectorAll(".booking-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        this.formData[e.target.name] = e.target.value;
      });
    });
  }

  displayStep(step) {
    const steps = document.querySelectorAll(".booking-step");
    const progressBar = document.querySelector(".booking-progress");

    steps.forEach((s) => s.classList.remove("active"));

    const activeStep = document.querySelector(
      `.booking-step[data-step="${step}"]`,
    );
    if (activeStep) {
      activeStep.classList.add("active");
      activeStep.style.animation = "fadeInUp 0.5s ease-out";
    }

    if (progressBar) {
      const progress = (step / 4) * 100;
      progressBar.style.width = progress + "%";
    }

    const prevBtn = document.querySelector(".prev-step-btn");
    const nextBtn = document.querySelector(".next-step-btn");

    if (prevBtn) prevBtn.style.display = step === 1 ? "none" : "inline-block";
    if (nextBtn) nextBtn.style.display = step === 4 ? "none" : "inline-block";
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < 4) {
        this.currentStep++;
        this.displayStep(this.currentStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      this.showValidationError();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.displayStep(this.currentStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  validateStep(step) {
    const inputs = document.querySelectorAll(
      `.booking-step[data-step="${step}"] .booking-input`,
    );
    let isValid = true;

    inputs.forEach((input) => {
      if (input.hasAttribute("required") && !input.value) {
        isValid = false;
        input.style.borderColor = "#D19C4A";
        input.style.boxShadow = "0 0 0 3px rgba(209, 156, 74, 0.2)";
      } else {
        input.style.borderColor = "";
        input.style.boxShadow = "";
      }
    });

    return isValid;
  }

  showValidationError() {
    const alert = document.createElement("div");
    alert.className = "validation-alert";
    alert.innerHTML =
      '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields';
    alert.style.cssText = `
      background: linear-gradient(135deg, #D19C4A 0%, #DBB172 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
      animation: slideInDown 0.3s ease-out;
    `;

    const form = document.querySelector(".booking-form");
    if (form) {
      form.insertBefore(alert, form.firstChild);
      setTimeout(() => alert.remove(), 3000);
    }
  }

  submitForm() {
    console.log("\n🔍 Form Validation Started");
    console.log("Current Step:", this.currentStep);
    
    if (this.validateStep(4)) {
      console.log("✅ Step 4 Validation Passed");
      console.log("📋 Form Data:", this.formData);
      
      // Disable submit button to prevent double submission
      const submitBtn = document.querySelector(".submit-booking-btn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";
      }
      
      // Send data to backend
      this.sendToBackend();
    } else {
      console.log("❌ Step 4 Validation Failed");
      console.log("Required fields missing in step 4");
      this.showValidationError();
    }
  }

  showSuccessMessage() {
    const success = document.createElement("div");
    success.className = "success-message";
    success.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <h3>Booking Request Submitted!</h3>
      <p>Thank you for choosing AR Events. Your booking has been sent to our system and we'll contact you shortly to confirm your event details.</p>
      <small style="display: block; margin-top: 0.5rem; opacity: 0.8;">✓ Data synced with server</small>
      <small style="display: block; margin-top: 0.3rem; opacity: 0.7; font-size: 12px;">Admin Dashboard: <a href="http://localhost:3001/admin/dashboard" target="_blank" style="color: #D19C4A; text-decoration: none;">View Booking</a></small>
    `;
    success.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
      text-align: center;
      z-index: 2000;
      max-width: 400px;
      animation: scaleIn 0.5s ease-out;
    `;
    success.querySelector("h3").style.cssText =
      "color: #D19C4A; margin-top: 1rem;";
    success.querySelector("i").style.cssText =
      "font-size: 3rem; color: #D19C4A;";
    success.querySelector("p").style.cssText =
      "color: #747577; margin-top: 0.5rem;";

    document.body.appendChild(success);

    setTimeout(() => {
      success.remove();
      window.location.href = "index.html";
    }, 4000);
  }

  sendToBackend() {
    // Validate all required fields before sending
    if (!this.formData.name || !this.formData.email || !this.formData.phone || !this.formData.eventType) {
      console.error("❌ Validation failed: Missing required fields", this.formData);
      showNotification("❌ Please fill all required fields before submitting.", "error");
      return;
    }

    const formPayload = {
      name: this.formData.name.trim(),
      email: this.formData.email.trim(),
      phone: this.formData.phone.trim(),
      eventType: this.formData.eventType,
      date: this.formData.date,
      message: this.formData.notes || "",
      package: this.formData.budget || "Standard",
      status: "Pending"
    };

    console.log("\n========== BOOKING FORM SUBMISSION ==========");
    console.log("📤 Sending booking to backend...");
    console.log("🌐 Backend URL: http://localhost:3500/submit-booking");
    console.log("📋 Form Data:", formPayload);
    console.log("=========================================\n");

    fetch("http://localhost:3500/submit-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formPayload),
    })
      .then((response) => {
        console.log("📡 Response received!", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("\n✅ SUCCESS! Booking submitted:", data);
        console.log("📊 Booking ID:", data.id || data._id || "Pending confirmation");
        console.log("=========================================\n");
        
        showNotification("✅ Booking submitted successfully!", "success");
        
        // Reset form
        this.formData = {
          eventType: "",
          date: "",
          location: "",
          guestCount: "",
          budget: "",
          requirements: "",
          name: "",
          email: "",
          phone: "",
          notes: "",
        };
        
        // Redirect after success
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      })
      .catch((err) => {
        console.error("\n❌ ERROR sending booking!");
        console.error("Error Message:", err.message);
        console.error("Full Error:", err);
        console.error("\n🔧 Troubleshooting Steps:");
        console.error("   1. ✓ Check if backend is running: http://localhost:3500");
        console.error("   2. ✓ Check backend connectivity: http://localhost:3500/api/auth/check");
        console.error("   3. ✓ Check browser console for CORS errors");
        console.error("   4. ✓ Verify form data in console above");
        console.error("=========================================\n");
        
        const errorMsg = err.message.includes('Failed to fetch') 
          ? "❌ Cannot connect to backend. Ensure port 3500 is running."
          : `❌ Error: ${err.message}`;
        
        showNotification(errorMsg, "error");
      });
  }
}

/**
 * Compact Form Handler - For quick "Schedule Consultation" form
 */
class CompactBookingForm {
  constructor() {
    this.form = document.querySelector(".booking-compact-form");
    this.backendUrl = "http://localhost:3500";
    this.init();
  }

  init() {
    if (!this.form) return;
    
    // Test CORS connectivity
    this.testCORSConnectivity();
    
    // Prevent default form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    console.log("✅ Compact booking form handler initialized");
  }

  testCORSConnectivity() {
    fetch(`${this.backendUrl}/cors-test`)
      .then(res => res.json())
      .then(data => {
        console.log("\n✅ CORS Connectivity Test:");
        console.log("  Status: Connected");
        console.log("  Backend: " + this.backendUrl);
        console.log("  Your Origin: " + window.location.origin);
        console.log("");
      })
      .catch(err => {
        console.warn("\n⚠️ CORS Connectivity Test Failed:");
        console.warn("  Error: " + err.message);
        console.warn("  Backend: " + this.backendUrl);
        console.warn("  Your Origin: " + window.location.origin);
        console.warn("  Make sure backend is running on port 3500\n");
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    console.log("\n========== COMPACT FORM SUBMISSION ==========");
    console.log("🔍 Form Validation Started");
    
    // Get form data
    const formData = new FormData(this.form);
    const data = {
      name: formData.get("name")?.trim() || "",
      email: formData.get("email")?.trim() || "",
      phone: formData.get("phone")?.trim() || "",
      eventType: formData.get("event-type") || "",
      message: formData.get("message")?.trim() || "",
      status: "Pending"
    };

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.eventType) {
      console.error("❌ Validation failed: Missing required fields");
      console.error("Data received:", data);
      showNotification("❌ Please fill all required fields before submitting.", "error");
      return;
    }

    console.log("✅ Validation Passed");
    console.log("📋 Form Data:", data);
    
    // Disable submit button
    const submitBtn = this.form.querySelector(".btn-submit-booking");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "📤 Submitting...";
    }
    
    // Send to backend
    this.sendToBackend(data);
  }

  sendToBackend(data) {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      eventType: data.eventType,
      date: new Date().toISOString().split('T')[0],
      message: data.message,
      package: "Consultation",
      status: "Pending"
    };

    console.log("🌐 Backend URL: " + this.backendUrl + "/submit-booking");
    console.log("📨 Send URL: POST /submit-booking");
    console.log("📦 Payload:", payload);
    console.log("==========================================\n");

    fetch(this.backendUrl + "/submit-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        console.log("📡 Response received!");
        console.log("  Status:", response.status);
        console.log("  Status Text:", response.statusText);
        console.log("  OK:", response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json().catch(() => ({ success: true }));
      })
      .then((data) => {
        console.log("\n✅ SUCCESS! Consultation request submitted:");
        console.log("  Response:", data);
        console.log("==========================================\n");
        
        // Re-enable and reset button
        const submitBtn = this.form.querySelector(".btn-submit-booking");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Schedule a Consultation ✓";
        }
        
        showNotification("✅ Consultation request submitted successfully!", "success");
        
        // Reset form
        this.form.reset();
        
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      })
      .catch((err) => {
        console.error("\n❌ ERROR submitting consultation!");
        console.error("  Error Message:", err.message);
        console.error("  Full Error:", err);
        console.error("\n🔧 Troubleshooting CORS Issues:");
        console.error("  1. Backend Status: http://localhost:3500");
        console.error("  2. CORS Test: http://localhost:3500/cors-test");
        console.error("  3. Your Origin: " + window.location.origin);
        console.error("  4. Is backend running on port 3500?");
        console.error("  5. Check server.js CORS configuration");
        console.error("  6. Browser DevTools → Network tab for detailed CORS errors");
        console.error("==========================================\n");
        
        // Re-enable button
        const submitBtn = this.form.querySelector(".btn-submit-booking");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Schedule a Consultation";
        }
        
        const errorMsg = err.message.includes('Failed to fetch') 
          ? "❌ Cannot connect to backend on port 3500. Is it running?"
          : `❌ Error: ${err.message}`;
        
        showNotification(errorMsg, "error");
      });
  }
}

// Initialize booking forms when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎉 Booking Form Scripts Loaded");
  console.log("🔗 Backend: http://localhost:3500");
  console.log("🌐 Port: 3500\n");
  
  // Initialize multi-step booking form
  if (document.querySelector(".booking-form")) {
    console.log("✅ Multi-step booking form found, initializing...");
    window.bookingForm = new BookingForm();
    console.log("✅ BookingForm instance created successfully\n");
  } else {
    console.warn("⚠️ Multi-step booking form HTML element not found");
  }

  // Initialize compact booking form
  if (document.querySelector(".booking-compact-form")) {
    console.log("✅ Compact booking form found, initializing...");
    window.compactBookingForm = new CompactBookingForm();
    console.log("✅ CompactBookingForm instance created successfully\n");
  } else {
    console.warn("⚠️ Compact booking form HTML element not found");
  }
});
