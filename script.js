const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

const promptBtn = document.getElementById("promptBtn");
const editBtn = document.getElementById("editBtn");

const promptArea = document.getElementById("promptArea");
const prompt = document.getElementById("prompt");

const runAI = document.getElementById("runAI");
const loading = document.getElementById("loading");

const resultText = document.getElementById("resultText");
const resultImage = document.getElementById("resultImage");

let selectedMode = "";
let selectedFile = null;

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = function (e) {

        preview.src = e.target.result;
        preview.style.display = "block";

    };

    reader.readAsDataURL(file);

});


promptBtn.onclick = () => {

    selectedMode = "prompt";

    promptArea.classList.add("hidden");

    promptBtn.style.border = "2px solid #00d9ff";
    editBtn.style.border = "";

};

editBtn.onclick = () => {

    selectedMode = "edit";

    promptArea.classList.remove("hidden");

    editBtn.style.border = "2px solid #00d9ff";
    promptBtn.style.border = "";

};

runAI.onclick = async () => {

    if (!selectedFile) {

        alert("Silakan upload gambar terlebih dahulu.");
        return;

    }

    if (!selectedMode) {

        alert("Pilih fitur AI terlebih dahulu.");
        return;

    }

    if (selectedMode === "edit" && prompt.value.trim() === "") {

        alert("Masukkan prompt terlebih dahulu.");
        return;

    }

    loading.classList.remove("hidden");

    resultText.value = "";
    resultImage.style.display = "none";

    const formData = new FormData();

    formData.append("image", selectedFile);
    formData.append("mode", selectedMode);
    formData.append("prompt", prompt.value);

    try {

        const response = await fetch("http://localhost:3000/api/ai", {

            method: "POST",
            body: formData

        });

        const data = await response.json();

        loading.classList.add("hidden");

        if (!data.success) {

            alert(data.error);
            return;

        }

        if (selectedMode === "prompt") {

            resultText.value = data.prompt;

        }

        if (selectedMode === "edit") {

            resultImage.src = data.image;
            resultImage.style.display = "block";

        }

    } catch (err) {

        loading.classList.add("hidden");

        alert("Server tidak dapat dihubungi.");

        console.error(err);

    }

};


document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mousemove", e => {

        const x = e.offsetX;
        const y = e.offsetY;

        card.style.background =
            `radial-gradient(circle at ${x}px ${y}px,
            rgba(0,217,255,.25),
            rgba(255,255,255,.05))`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.background = "rgba(255,255,255,.05)";

    });

});