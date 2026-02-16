/**
 * services offered by the repair shop, each service includes: id, name, price, duration, description, image, and what's included
 * we are missing step 3 to 5 still
 */
const services = [
    {
        id: 'brake-tune',
        name: 'Brake Tune & Fix',
        price: 45,
        duration: '30-45 mins',
        description: 'Complete brake system inspection and adjustment',
        image: 'photoss/braketuning.jpg',
        included: ['Brake pad inspection', 'Cable adjustment', 'Lever alignment', 'Safety test']
    },
    {
        id: 'flat-tire',
        name: 'Flat Tire Fix',
        price: 25,
        duration: '20-30 mins',
        description: 'Quick and reliable tire repair or replacement',
        image: 'photoss/flattire.jpg',
        included: ['Puncture repair', 'Tube replacement if needed', 'Tire pressure check', 'Wheel inspection']
    },
    {
        id: 'steering-fix',
        name: 'Steering Fix',
        price: 55,
        duration: '45-60 mins',
        description: 'Handlebar and headset repair and alignment',
        image: 'photoss/steeringfix.jpg',
        included: ['Headset adjustment', 'Handlebar alignment', 'Stem tightening', 'Steering smoothness test']
    },
    {
        id: 'upgrades',
        name: 'Upgrades',
        price: 75,
        duration: '60-90 mins',
        description: 'Component upgrades and performance enhancements',
        image: 'photoss/upgrading.jpg',
        included: ['Component installation', 'Gear tuning', 'Performance optimization', 'Test ride']
    },
    {
        id: 'replacements',
        name: 'Replacements',
        price: '100-200',
        duration: 'depends on required parts',
        description: 'Part replacement and installation service',
        image: 'photoss/replacements.jpg',
        included: ['Old part removal', 'New part installation', 'Compatibility check', 'Functional testing']
    },
    {
        id: 'full-maintenance',
        name: 'Full Maintenance',
        price: 120,
        duration: '100-150 mins',
        description: 'Comprehensive tune-up and maintenance service',
        image: 'photoss/fullmaintenance.jpg',
        included: ['Complete inspection', 'Drivetrain cleaning', 'All adjustments', 'Lubrication', 'Safety check']
    }
];

/*staff members with their expertise and characteristics, each staff includes: id, name, role, experience, expertise, availability*/
const staff = [
    {
        id: 'sarah-m',
        name: 'Sarah Mitchell',
        role: 'Master Technician',
        experience: '12 years',
        expertise: ['Brake Systems', 'Full Maintenance', 'Steering'],
        specialty: 'Expert in hydraulic brake systems and precision tuning',
        availability: 'Mon-Fri'
    },
    {
        id: 'james-c',
        name: 'James Chen',
        role: 'Senior Technician',
        experience: '8 years',
        expertise: ['Upgrades', 'Replacements', 'Flat Tire'],
        specialty: 'Specializes in component upgrades and custom builds',
        availability: 'Tue-Sat'
    },
    {
        id: 'maria-r',
        name: 'Maria Rodriguez',
        role: 'Certified Mechanic',
        experience: '6 years',
        expertise: ['Full Maintenance', 'Flat Tire', 'Brake Systems'],
        specialty: 'Quick service specialist with attention to detail',
        availability: 'Mon-Sat'
    },
    {
        id: 'alex-k',
        name: 'Alex Kowalski',
        role: 'Bike Technician',
        experience: '5 years',
        expertise: ['Steering', 'Replacements', 'Upgrades'],
        specialty: 'Modern bike systems and electronic shifting expert',
        availability: 'Wed-Sun'
    },
    {
        id: 'david-l',
        name: 'David Lee',
        role: 'Junior Technician',
        experience: '3 years',
        expertise: ['Flat Tire', 'Brake Systems', 'Replacements'],
        specialty: 'Enthusiastic and detail-oriented with quick turnaround times',
        availability: 'Mon-Fri'
    },
    {
        id: 'emma-p',
        name: 'Emma Peterson',
        role: 'Expert Technician',
        experience: '10 years',
        expertise: ['Full Maintenance', 'Upgrades', 'Steering'],
        specialty: 'Specialized in high-end bikes and carbon fiber repairs',
        availability: 'Thu-Sun'
    }
];

// contact information for step 4
let contactInfo = {
    firstName:"",
    lastName:"",
    email:"",
    phone:"",
    notes:""
};

// global state is set to keep track of selected service, staff, and current step in the booking process
let selectedService = null;
let selectedStaff = null;
let currentStep = 1;

/*initialize the application when DOM is ready*/
document.addEventListener('DOMContentLoaded', function() {
    renderServices();
    initializeEventListeners();
    initializeTooltips();
});

/*rendering all the service cards*/
function renderServices() {
    const container = document.getElementById('serviceCards');
    container.innerHTML = '';
    
    services.forEach(service => {
        const card = createServiceCard(service);
        container.appendChild(card);
    });
}

/**
 * creating a single service card
 * @param {Object} service - Service object
 * @returns {HTMLElement} Card element
 */
function createServiceCard(service) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    col.innerHTML = `
        <div class="card service-card" 
             data-service-id="${service.id}" 
             tabindex="0" 
             role="button"
             aria-label="Select ${service.name} service">
            <i class="bi bi-check-circle-fill card-check"></i>
            <img src="${service.image}" 
                 class="card-img-top" 
                 alt="${service.name} - ${service.description}">
            <div class="card-body">
                <h5 class="card-title">
                    <i class="bi bi-tools"></i> ${service.name}
                </h5>
                <p class="card-text text-muted">${service.description}</p>
                
                <div class="mb-3">
                    <span class="price-badge">$${service.price}</span>
                    <span class="duration-badge ms-2">
                        <i class="bi bi-clock"></i> ${service.duration}
                    </span>
                </div>
                
                <p class="small mb-2"><strong>What's included:</strong></p>
                <ul class="service-details small">
                    ${service.included.map(item => `<li><i class="bi bi-check2"></i> ${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    return col;
}

/*rendering all staff cards*/
function renderStaff() {
    const container = document.getElementById('staffCards');
    container.innerHTML = '';
    
    // adding the filtering logic to show staff members based on the selected service's expertise requirements
    const relevantStaff = staff.filter(member => {
        if (!selectedService) return true;
        // our own checker to see if the staff expertise matches the selected service
        return member.expertise.some(exp => 
            selectedService.name.includes(exp) || exp.includes('Full Maintenance')
        );
    });
    
    // we show all staff if nothing specific is selected
    const staffToShow = relevantStaff.length > 0 ? relevantStaff : staff;
    
    staffToShow.forEach(member => {
        const card = createStaffCard(member);
        container.appendChild(card);
    });
}

/**
 * creating a single staff card
 * @param {Object} member - Staff member object
 * @returns {HTMLElement} Card element
 */
function createStaffCard(member) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3';
    
    // extracting initials from staff name
    const initials = member.name.split(' ').map(n => n[0]).join('');
    
    col.innerHTML = `
        <div class="card staff-card" 
             data-staff-id="${member.id}" 
             tabindex="0" 
             role="button"
             aria-label="Select ${member.name}, ${member.role}">
            <i class="bi bi-check-circle-fill card-check"></i>
            <div class="card-body text-center">
                <div class="staff-initials">${initials}</div>
                <h5 class="card-title">${member.name}</h5>
                <p class="text-muted mb-2">${member.role}</p>
                
                <div class="mb-2">
                    <i class="bi bi-star-fill text-warning"></i>
                    <small>${member.experience} experience</small>
                </div>
                
                <p class="small mb-2"><strong>Expertise:</strong></p>
                <div class="mb-2">
                    ${member.expertise.map(exp => 
                        `<span class="expertise-badge">${exp}</span>`
                    ).join('')}
                </div>
                
                <p class="small text-muted mb-2">
                    <i class="bi bi-info-circle" 
                       data-bs-toggle="tooltip" 
                       data-bs-placement="top" 
                       title="${member.specialty}"></i>
                    ${member.specialty}
                </p>
                
                <p class="small mb-0">
                    <i class="bi bi-calendar-check"></i> Available: ${member.availability}
                </p>
            </div>
        </div>
    `;
    
    return col;
}

/*initializing all event listeners*/
function initializeEventListeners() {
    //service card selection
    document.getElementById('serviceCards').addEventListener('click', handleServiceSelection);
    document.getElementById('serviceCards').addEventListener('keypress', handleServiceKeyPress);
    
    //staff card selection
    document.getElementById('staffCards').addEventListener('click', handleStaffSelection);
    document.getElementById('staffCards').addEventListener('keypress', handleStaffKeyPress);
    
    //navigation buttons
    document.getElementById('nextToStep2').addEventListener('click', goToStep2);
    document.getElementById('nextToStep3').addEventListener('click', goToStep3);
    document.getElementById('nextToStep4').addEventListener('click', goToStep4);
    document.getElementById('nextToStep5').addEventListener('click', goToStep5);
    document.getElementById('backToStep1').addEventListener('click', goToStep1);
    document.getElementById('backToStep2').addEventListener('click', goToStep2);
    document.getElementById('backToStep3').addEventListener('click', goToStep3);
    document.getElementById('backToStep4').addEventListener('click', goToStep4);

    document.getElementById('submitBooking').addEventListener('click', submitBooking);

    // step 4 validation
    hookContactValidation();
}

function hookContactValidation(){
    const form = document.getElementById('step4');
    const nextBtn = document.getElementById('nextToStep5'); 

    const first = document.getElementById('contactFirstName');
    const last = document.getElementById('contactLastName');
    const email = document.getElementById('contactEmail');
    const phone = document.getElementById('contactPhone');
    const notes = document.getElementById('contactNotes');

    function validate(){
        const firstValid = first.value.trim().length > 0;
        const lastValid = last.value.trim().length > 0;
        const emailValid = (email.value.trim().length > 0) && email.checkValidity();
        const phoneValid = phone.value.trim().length == 10;

        const overallValid = firstValid && lastValid && (emailValid || phoneValid);

        nextBtn.disabled = !overallValid;

        if (overallValid) {
            contactInfo = {
                firstName: first.value.trim(),
                lastName: last.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
                notes: notes ? notes.value.trim() : ""
            };
        }
    }

    // validate live
    [first, last, email, phone, notes].forEach(el => {
        if (!el) return;
        el.addEventListener('input', validate);
        el.addEventListener('change', validate);
    });

    validate();
}

// for step 5 
function populateFinalSummary(){
    const setText = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt ?? "";
    };

    setText('finalService', selectedService ? selectedService.name : "");
    setText('finalStaff', selectedStaff ? `${selectedStaff.name} (${selectedStaff.role})` : "");
    setText('finalPrice', selectedService ? `$${selectedService.price}` : "");
    setText('finalDuration', selectedService ? selectedService.duration : "");

    setText('finalDate', bookingDate ? ymd(bookingDate) : "");
    setText('finalTime', bookingTime || "");

    setText('finalName', `${contactInfo.firstName} ${contactInfo.lastName}`.trim());
    setText('finalEmail', contactInfo.email || "N/A");
    setText('finalPhone', contactInfo.phone || "N/A");
}

function submitBooking() {
    const box = document.getElementById('submitResult');
    if (!box) return;

    box.style.display = 'block';
    box.className = 'alert alert-success';

    const when = bookingDate && bookingTime ? `${ymd(bookingDate)} at ${bookingTime}` : "your selected time";

    box.innerHTML = `
        <strong>Booking confirmed.</strong><br>
        Appointment: ${when}<br>
        Service: ${selectedService ? selectedService.name : ""}<br>
        Technician: ${selectedStaff ? selectedStaff.name : ""}<br>
        Contact: ${contactInfo.email || contactInfo.phone}
    `;
}

/**
 * handling service card selection
 * @param {Event} event - Click event
 */
function handleServiceSelection(event) {
    const card = event.target.closest('.service-card');
    if (!card) return;
    
    const serviceId = card.dataset.serviceId;
    selectService(serviceId);
}

/**
 * handling keyboard navigation for service cards
 * @param {Event} event - this is for keypress event
 */
function handleServiceKeyPress(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleServiceSelection(event);
    }
}

/**
 * handling staff card selection
 * @param {Event} event - this one for click event
 */
function handleStaffSelection(event) {
    const card = event.target.closest('.staff-card');
    if (!card) return;
    
    const staffId = card.dataset.staffId;
    selectStaff(staffId);
}

/**
 * handling keyboard navigation for staff cards
 * @param {Event} event - keypress event once again
 */
function handleStaffKeyPress(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleStaffSelection(event);
    }
}

/**
 * selecting a service
 * @param {string} serviceId - we will use the service ID
 */
function selectService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    //updating global state
    selectedService = service;
    
    //and updating the UI to reflect the selection
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-service-id="${serviceId}"]`);
    selectedCard.classList.add('selected');
    
    //selection summary for the user to see what they selected
    document.getElementById('serviceSelectionSummary').style.display = 'block';
    document.getElementById('selectedServiceText').innerHTML = `
        <strong>${service.name}</strong> - $${service.price} (${service.duration})
    `;
    
    //we only enable the next button after a service is selected to guide the user through the process
    document.getElementById('nextToStep2').disabled = false;
}

/**
 * selecting a staff member
 * @param {string} staffId - using the staff ID to find the staff member
 */
function selectStaff(staffId) {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;
    
    //we update global state
    selectedStaff = staffMember;
    
    //and update the UI to show which staff member is selected
    document.querySelectorAll('.staff-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-staff-id="${staffId}"]`);
    selectedCard.classList.add('selected');
    
    //selection summary once again
    document.getElementById('staffSelectionSummary').style.display = 'block';
    document.getElementById('summaryService').textContent = selectedService.name;
    document.getElementById('summaryStaff').textContent = `${staffMember.name} (${staffMember.role})`;
    document.getElementById('summaryPrice').textContent = `$${selectedService.price}`;
    document.getElementById('summaryDuration').textContent = selectedService.duration;
    
    //enabling next button for step 3 only after a staff member is selected
    document.getElementById('nextToStep3').disabled = false;
}

/*navigate to Step 1*/
function goToStep1() {
    currentStep = 1;
    updateStepDisplay();
    updateProgressBar();
}

/*navigate to Step 2*/
function goToStep2() {
    if (!selectedService && currentStep === 1) {
        alert('Please select a service first.');
        return;
    }
    
    currentStep = 2;
    renderStaff();
    updateStepDisplay();
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/*navigate to Step 3... HERE WE ARE MISSING DEVELOPMENT FOR STEP 3 TO 5*/
function goToStep3() {
    if (!selectedStaff) {
        alert('Please select a technician first.');
        return;
    }
    
    currentStep = 3;
    updateStepDisplay();
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initStep3Calendar();
    
    /**
     * CONTINUE THE WORK TEAM:
     * At this point, you have access to:
     * - selectedService (object with all service details)
     * - selectedStaff (object with all staff details)
     */
}

function goToStep4() {
    if (!bookingDate || !bookingTime) {
        alert('Please choose a date and time first.');
        return;
    }

    currentStep = 4;
    updateStepDisplay();
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep5() {
    const nextBtn = document.getElementById('nextToStep5');
    if (nextBtn && nextBtn.disabled) {
        alert('Please enter your contact info (full name + email or phone).');
        return;
    }

    currentStep = 5;
    updateStepDisplay();
    updateProgressBar();
    populateFinalSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/*update which step section is visible*/
function updateStepDisplay() {
    document.getElementById('step1').style.display = currentStep === 1 ? 'block' : 'none';
    document.getElementById('step2').style.display = currentStep === 2 ? 'block' : 'none';
    document.getElementById('step3').style.display = currentStep === 3 ? 'block' : 'none';
    document.getElementById('step4').style.display = currentStep === 4 ? 'block' : 'none';
    document.getElementById('step5').style.display = currentStep === 5 ? 'block' : 'none';
    
    // Update step labels
    document.getElementById('step1Label').className = currentStep === 1 ? 'step-active' : '';
    document.getElementById('step2Label').className = currentStep === 2 ? 'step-active' : '';
    document.getElementById('step3Label').className = currentStep === 3 ? 'step-active' : '';
    document.getElementById('step4Label').className = currentStep === 4 ? 'step-active' : '';
    document.getElementById('step5Label').className = currentStep === 5 ? 'step-active' : '';
}

/*Update progress bar based on current step*/
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const percentage = (currentStep / 5) * 100;
    
    progressBar.style.width = percentage + '%';
    progressBar.setAttribute('aria-valuenow', percentage);
    
    const stepTexts = [
        'Step 1: Select Service',
        'Step 2: Select Staff',
        'Step 3: Schedule & Details',
        'Step 4: Enter Contact',
        'Step 5: Confirm'
    ];
    
    progressBar.textContent = stepTexts[currentStep - 1];
}

/*initializing Bootstrap tooltips*/
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Get current booking data
 * This function can be called by Step 3+ to access the booking data
 * @returns {Object} Current booking information
 */
function getBookingData() {
    return {
        service: selectedService,
        staff: selectedStaff,
        step: currentStep
    };
}

/**
 *log current state for debugging purposes, this can be called from the console to see what's currently selected and which step the user is on
 */
function debugState() {
    console.log('=== Current Booking State ===');
    console.log('Current Step:', currentStep);
    console.log('Selected Service:', selectedService);
    console.log('Selected Staff:', selectedStaff);
    console.log('===========================');
}
let bookingDate = null; // Date object
let bookingTime = "";   // string like "10:30"

// Convert days to numbers
function dayNameToIndex(dayName) {
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[dayName] ?? null;
}

function parseAvailabilityToAllowedDays(availabilityStr) {
  const parts = availabilityStr.split('-').map(s => s.trim());
  if (parts.length !== 2) return new Set([0,1,2,3,4,5,6]);

  const start = dayNameToIndex(parts[0]);
  const end = dayNameToIndex(parts[1]);
  if (start === null || end === null) return new Set([0,1,2,3,4,5,6]);

  const allowed = new Set();
  let i = start;
  while (true) {
    allowed.add(i);
    if (i === end) break;
    i = (i + 1) % 7;
  }
  return allowed;
}

// Format date as YYYY-MM-DD
function ymd(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Month label like "February 2026"
function monthLabel(d) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

// Initialize calendar when entering Step 3
function initStep3Calendar() {
  const calDays = document.getElementById("calDays");
  const calMonthLabelEl = document.getElementById("calMonthLabel");
  const calPrev = document.getElementById("calPrev");
  const calNext = document.getElementById("calNext");

  const selectedDateText = document.getElementById("selectedDateText");
  const timeSelect = document.getElementById("timeSelect");
  const scheduleSummary = document.getElementById("scheduleSummary");
  const nextToStep4 = document.getElementById("nextToStep4");

  // Step 3 summary elements
  const step3BookingSummary = document.getElementById("step3BookingSummary");
  const step3SummaryService = document.getElementById("step3SummaryService");
  const step3SummaryStaff = document.getElementById("step3SummaryStaff");
  const step3SummaryPrice = document.getElementById("step3SummaryPrice");
  const step3SummaryDuration = document.getElementById("step3SummaryDuration");
  const step3SummaryDate = document.getElementById("step3SummaryDate");
  const step3SummaryTime = document.getElementById("step3SummaryTime");

  // Safety check
  if (!calDays || !calMonthLabelEl || !calPrev || !calNext) return;

  // Reset selection every time you enter step 3
  bookingDate = null;
  bookingTime = "";
  timeSelect.innerHTML = `<option value="" selected disabled>Select a time</option>`;
  timeSelect.disabled = true;
  nextToStep4.disabled = true;
  if (step3BookingSummary) step3BookingSummary.style.display = "none";

  const allowedDays = selectedStaff
    ? parseAvailabilityToAllowedDays(selectedStaff.availability)
    : new Set([0,1,2,3,4,5,6]);

  // Current month being displayed
  let view = new Date();
  view.setDate(1);
  view.setHours(0, 0, 0, 0);

  // Today (disable past)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function renderCalendar() {
    calMonthLabelEl.textContent = monthLabel(view);
    calDays.innerHTML = "";

    const year = view.getFullYear();
    const month = view.getMonth();

    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty grid cells before day 1
    for (let i = 0; i < firstDow; i++) {
      const blank = document.createElement("div");
      blank.style.height = "3rem";
      calDays.appendChild(blank);
    }

    // Day buttons
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      d.setHours(0, 0, 0, 0);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn cal-btn";
      btn.textContent = day;

      const isPast = d < today;
      const isAllowed = allowedDays.has(d.getDay());
      if (isPast || !isAllowed) btn.disabled = true;

      if (bookingDate && ymd(d) === ymd(bookingDate)) {
        btn.classList.add("selected");
      }

      btn.addEventListener("click", () => {
        bookingDate = d;
        bookingTime = "";
        timeSelect.disabled = false;

        // Fill time slots
        const slots = ["09:00","09:30","10:00","10:30","11:00","11:30",
          "13:30","14:00","14:30","15:00","15:30","16:00",
          "16:30","17:00","17:30"];

        timeSelect.innerHTML = `<option value="" selected disabled>Select a time</option>`;
        slots.forEach(t => {
          const opt = document.createElement("option");
          opt.value = t;
          opt.textContent = t;
          timeSelect.appendChild(opt);
        });

        updateSummary();
        renderCalendar();
      });

      calDays.appendChild(btn);
    }
  }

  function updateSummary() {
    const techInfo = selectedStaff ? selectedStaff.availability : "All days";

    // No date
    if (!bookingDate) {
      selectedDateText.textContent = `No date selected (Tech availability: ${techInfo})`;
      scheduleSummary.textContent = "No date/time chosen yet.";
      nextToStep4.disabled = true;
      if (step3BookingSummary) step3BookingSummary.style.display = "none";
      return;
    }

    selectedDateText.textContent = `Selected date: ${ymd(bookingDate)} (Tech availability: ${techInfo})`;

    // No time
    if (!bookingTime) {
      scheduleSummary.textContent = `Date: ${ymd(bookingDate)} — Time: (not selected)`;
      nextToStep4.disabled = true;
      if (step3BookingSummary) step3BookingSummary.style.display = "none";
      return;
    }

    // Date + time chosen
    scheduleSummary.textContent = `Date: ${ymd(bookingDate)} — Time: ${bookingTime}`;
    nextToStep4.disabled = false;

    if (step3BookingSummary) step3BookingSummary.style.display = "block";

    if (step3SummaryService) step3SummaryService.textContent = selectedService ? selectedService.name : "";
    if (step3SummaryStaff) step3SummaryStaff.textContent = selectedStaff ? `${selectedStaff.name} (${selectedStaff.role})` : "";
    if (step3SummaryPrice) step3SummaryPrice.textContent = selectedService ? `$${selectedService.price}` : "";
    if (step3SummaryDuration) step3SummaryDuration.textContent = selectedService ? selectedService.duration : "";
    if (step3SummaryDate) step3SummaryDate.textContent = ymd(bookingDate);
    if (step3SummaryTime) step3SummaryTime.textContent = bookingTime;
  }

  // IMPORTANT: bind events
  timeSelect.addEventListener("change", (e) => {
    bookingTime = e.target.value || "";
    updateSummary();
  });

  calPrev.onclick = () => {
    view.setMonth(view.getMonth() - 1);
    renderCalendar();
  };

  calNext.onclick = () => {
    view.setMonth(view.getMonth() + 1);
    renderCalendar();
  };

  // IMPORTANT: initial render
  renderCalendar();
  updateSummary();
}

//I made these utility functions available globally for team developers
window.getBookingData = getBookingData;
window.debugState = debugState;
