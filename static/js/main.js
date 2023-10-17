const subscribe = async() => {
    let//
    discordEndpoint = document.querySelector("").value,
    locationForSubcription = document.querySelector("").value;

    try {
        let response = await fetch("", {
            method: "POST",
            body: JSON.stringify({
                "discordEndpoint": discordEndpoint,
                "locationForSubcription": locationForSubcription
            })
        });

        let result = await response.json();

        if (!response.ok) {
            console.log(result.description)
            throw("Subscription failed.");
            // render fail msg
        };

        return("Subscription succeeded.")
        // render succes msg
    }
    catch(error) {
        console.log(error);
    }
}