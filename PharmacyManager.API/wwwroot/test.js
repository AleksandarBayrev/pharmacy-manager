(async () => {
    const path = "/api/medicines/getAllMedicines";
    try {
        const result = await fetch("/api/medicines/getAllMedicines", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                page: 1,
                itemsPerPage: 20
            })
        }).then(x => x.json());
        result.map(x => document.getElementById('test').innerHTML += `<div id="${x.id}">ID: ${x.id}</div><div id="${x.id}-${x.name}">${x.name}</div>`);
    } catch (err) {
        document.getElementById("test").innerHTML = `Request to ${path} failed!`;
    }
})();