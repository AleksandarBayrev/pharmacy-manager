const fetchData = async () => {
    const path = "/api/medicines/getAllMedicines";
    document.getElementById("test").innerHTML = "";
    try {
        const result = await fetch("/api/medicines/getAllMedicines", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                page: Math.floor((Math.random() * 1000)),
                itemsPerPage: Math.floor((Math.random() * 100))
            })
        }).then(x => x.json());
        result.map(x => document.getElementById('test').innerHTML += `<div id="${x.id}">ID: ${x.id}</div><div id="${x.id}-${x.name}">${x.name}</div>`);
    } catch (err) {
        document.getElementById("test").innerHTML = `Request to ${path} failed!`;
    }
};

setInterval(fetchData, 1000);