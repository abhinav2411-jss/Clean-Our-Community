const reportForm = document.getElementById("reportForm");
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");
const previewContainer = document.getElementById("preview-container");
const successMessage = document.getElementById("successMessage");
const reportsContainer = document.getElementById("reportsContainer");

// Store reports
let reports = JSON.parse(localStorage.getItem("pollutionReports")) || [];

// ------------------------------------
// PHOTO PREVIEW
// ------------------------------------

photoInput.addEventListener("change", function () {
    const file = photoInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            photoPreview.src = event.target.result;
            previewContainer.style.display = "block";
        };

        reader.readAsDataURL(file);
    } else {
        photoPreview.src = "";
        previewContainer.style.display = "none";
    }
});

// ------------------------------------
// SUBMIT REPORT
// ------------------------------------

reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const file = photoInput.files[0];
    const location = document.getElementById("location").value.trim();
    const pollutionType =
        document.getElementById("pollutionType").value;
    const description =
        document.getElementById("description").value.trim();

    if (!file || !location || !pollutionType || !description) {
        alert("Please fill in all fields.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const report = {
            id: Date.now(),
            photo: event.target.result,
            location: location,
            pollutionType: pollutionType,
            description: description,
            date: new Date().toLocaleString()
        };

        // Add new report
        reports.unshift(report);

        // Save reports in browser
        localStorage.setItem(
            "pollutionReports",
            JSON.stringify(reports)
        );

        // Show success message
        successMessage.style.display = "block";

        // Reset form
        reportForm.reset();

        photoPreview.src = "";
        previewContainer.style.display = "none";

        // Display updated reports
        displayReports();

        // Hide success message after 4 seconds
        setTimeout(function () {
            successMessage.style.display = "none";
        }, 4000);

        // Scroll to reports
        setTimeout(function () {
            document.getElementById("reports").scrollIntoView({
                behavior: "smooth"
            });
        }, 500);
    };

    reader.readAsDataURL(file);
});

// ------------------------------------
// DISPLAY REPORTS
// ------------------------------------

function displayReports() {
    reportsContainer.innerHTML = "";

    if (reports.length === 0) {
        reportsContainer.innerHTML = `
            <div class="empty-message">
                No reports yet. Be the first person to report a polluted place!
            </div>
        `;

        return;
    }

    reports.forEach(function (report) {
        const reportCard = document.createElement("div");

        reportCard.className = "report-card";

        reportCard.innerHTML = `
            <img 
                src="${report.photo}" 
                alt="Pollution Report"
                class="report-image"
            >

            <div class="report-content">

                <h3>📍 ${escapeHTML(report.location)}</h3>

                <p>
                    <strong>Pollution Type:</strong>
                    ${escapeHTML(report.pollutionType)}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${escapeHTML(report.description)}
                </p>

                <p class="report-date">
                    📅 Reported on: ${escapeHTML(report.date)}
                </p>

                <button 
                    class="delete-btn"
                    onclick="deleteReport(${report.id})"
                >
                    🗑️ Delete Report
                </button>

            </div>
        `;

        reportsContainer.appendChild(reportCard);
    });
}

// ------------------------------------
// DELETE REPORT
// ------------------------------------

function deleteReport(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) {
        return;
    }

    reports = reports.filter(function (report) {
        return report.id !== id;
    });

    localStorage.setItem(
        "pollutionReports",
        JSON.stringify(reports)
    );

    displayReports();
}

// ------------------------------------
// PREVENT HTML INJECTION
// ------------------------------------

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ------------------------------------
// LOAD REPORTS WHEN PAGE OPENS
// ------------------------------------

displayReports();
