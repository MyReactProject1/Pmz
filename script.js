const SUPABASE_URL = "https://zrzaivmhfzswsktwzmxs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyemFpdm1oZnpzd3NrdHd6bXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTQ1ODMsImV4cCI6MjA2NDA3MDU4M30.F9MY9rttTwBTs-AlK37eTHdnH5EoiQmPJN-b7ZDlgLU";

function showMessage(text, type) {
  const msgEl = $("#message");
  msgEl
    .text(text)
    .removeClass("alert-success alert-danger")
    .addClass(`alert alert-${type}`)
    .removeClass("d-none")
    .show();
}

function clearMessage() {
  $("#message").text("").addClass("d-none");
}

$(document).ready(function () {
  const trackModalEl = document.getElementById("trackModal");
  const trackModal = new bootstrap.Modal(trackModalEl);

  $("#trackForm").on("submit", function (e) {
    e.preventDefault();
    const trackId = $("#trackIdInput").val().trim();
    clearMessage();
    $("#trackModalBody").empty();

    if (!trackId) {
      showMessage("Please enter a Track ID.", "danger");
      return;
    }

    // Show loader
    $("#loaderOverlay").fadeIn();

    const url = `${SUPABASE_URL}/rest/v1/mnl_logistics?track_id=eq.${encodeURIComponent(trackId)}&select=*`;

    fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        $("#loaderOverlay").fadeOut();

        if (data.length === 0) {
          showMessage("Shipment not found.", "danger");
          return;
        }

        data.forEach((item) => {
          const cardHtml = `
            <div class="card mb-3">
              <div class="card-body">
                <h5 class="card-title"><strong>Track ID:</strong> ${item.track_id}</h5>
                <p class="card-text"><strong>Name of Item:</strong> ${item.item_name}</p>
                <p class="card-text"><strong>Status:</strong> ${item.status}</p>
                <p class="card-text"><strong>Current Location:</strong> ${item.location}</p>
                <p class="card-text"><strong>Sent By:</strong> ${item.sender_name}</p>
                <p class="card-text"><strong>Sent From:</strong> ${item.sent_from}</p>
                <p class="card-text"><strong>Date Sent:</strong> ${item.sent_date}</p>
                <p class="card-text"><strong>Weight:</strong> ${item.weight}</p>
                <p class="card-text"><strong>Quantity:</strong> ${item.quantity}</p>
                <p class="card-text"><strong>Receiver's Name:</strong> ${item.receiver_name}</p>
                <p class="card-text"><strong>Destination:</strong> ${item.destination}</p>
              </div>
            </div>`;
          $("#trackModalBody").append(cardHtml);
        });

        showMessage("Shipment found!", "success");
        trackModal.show();
      })
      .catch((err) => {
        console.error(err);
        $("#loaderOverlay").fadeOut();
        showMessage("Error fetching shipment.", "danger");
      });
  });

  $("#resetButton").on("click", function () {
    location.reload(true);
  });
});