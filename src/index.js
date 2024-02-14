document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterBtn = document.getElementById("filter-btn");
    let filterOn = false;
  
    // Fetch and display all pups
    fetchPups();
  
    // Event listener for toggling filter
    filterBtn.addEventListener("click", () => {
      filterOn = !filterOn;
      filterBtn.textContent = filterOn ? "Filter Good Dogs: ON" : "Filter Good Dogs: OFF";
      fetchPups();
    });
  
    function fetchPups() {
      dogBar.innerHTML = ""; // Clear previous content
      fetch("http://localhost:3000/pups")
        .then(response => response.json())
        .then(pups => {
          pups.forEach(pup => {
            if (!filterOn || pup.isGoodDog) {
              displayPup(pup);
            }
          });
        })
        .catch(error => console.error("Error fetching pups:", error));
    }
  
    function displayPup(pup) {
      const span = document.createElement("span");
      span.textContent = pup.name;
      span.addEventListener("click", () => showPupInfo(pup));
      dogBar.appendChild(span);
    }
  
    function showPupInfo(pup) {
      dogInfo.innerHTML = ""; // Clear previous content
      const img = document.createElement("img");
      img.src = pup.image;
      const h2 = document.createElement("h2");
      h2.textContent = pup.name;
      const button = document.createElement("button");
      button.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";
      button.addEventListener("click", () => toggleGoodDog(pup));
      dogInfo.appendChild(img);
      dogInfo.appendChild(h2);
      dogInfo.appendChild(button);
    }
  
    function toggleGoodDog(pup) {
      const newStatus = !pup.isGoodDog;
      fetch(`http://localhost:3000/pups/${pup.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ isGoodDog: newStatus })
      })
      .then(response => response.json())
      .then(updatedPup => {
        pup.isGoodDog = updatedPup.isGoodDog;
        const button = document.querySelector("#dog-info button");
        button.textContent = updatedPup.isGoodDog ? "Good Dog!" : "Bad Dog!";
      })
      .catch(error => console.error("Error toggling good dog status:", error));
    }
  });
  