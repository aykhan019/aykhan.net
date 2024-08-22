function sendMail(event) {
    event.preventDefault();


    var params = {
        name: document.getElementById("name-input").value,
        email: document.getElementById("email-input").value,
        message: document.getElementById("message-input").value,
    };

    const serviceID = "service_b6pvtij";
    const templateID = "template_7lpe4tk";

    emailjs.send(serviceID, templateID, params)
        .then(res => {
            // document.getElementById("name").value = "";
            // document.getElementById("email").value = "";
            // document.getElementById("message").value = "";
            console.log(res);
            alert("Your message sent successfully!!")
        })
        .catch(err => {
            alert(err);
        });
}


