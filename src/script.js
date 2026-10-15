function scrollToGenerator() {
    document.getElementById("generator").scrollIntoView({
        behavior: "smooth"
    });
}


async function generateDescription() {

    const productName =
        document.getElementById("productName").value.trim();

    const category =
        document.getElementById("category").value.trim();

    const features =
        document.getElementById("features").value.trim();

    const descriptionBox =
        document.getElementById("description");


    if (!productName) {
        alert("Please enter product name.");
        return;
    }

    if (!category) {
        alert("Please enter product category.");
        return;
    }

    if (!features) {
        alert("Please enter product features.");
        return;
    }


    descriptionBox.innerText = "Generating description...";


    try {

        const response = await fetch(
            "http://localhost:5000/api/products/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    productName: productName,
                    category: category,
                    features: features
                })
            }
        );


        const data = await response.json();


        if (!response.ok || !data.success) {
            throw new Error(
            data.message || `Server error: ${response.status}`
            );
        }


        descriptionBox.innerText = data.description;


    } catch (error) {

        console.error(error);

        descriptionBox.innerText =
            error.message || "Unable to connect to backend.";
    }
}


function copyDescription() {

    const description =
        document.getElementById("description").innerText;


    if (
        !description ||
        description ===
        "Your AI-generated product description will appear here."
    ) {
        alert("Please generate a description first.");
        return;
    }


    navigator.clipboard.writeText(description)
        .then(() => {
            alert("Description copied successfully!");
        })
        .catch(() => {
            alert("Unable to copy description.");
        });
}

window.scrollToGenerator = scrollToGenerator;
window.generateDescription = generateDescription;
window.copyDescription = copyDescription;
