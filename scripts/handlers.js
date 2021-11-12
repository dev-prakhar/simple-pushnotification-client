function populate_select() {
        var select_element = document.getElementById('notification-dropdown');
        console.log("Inside populate select")
        fetch('http://localhost:8000/notification-app/notification-contents')
            .then(response => response.json())
            .then(data => convert_to_html(data, select_element));

    }

    function convert_to_html(response_data, select_element) {
        var html = "";
        for (var i = 0; i < response_data.length; i++) {
            html += '<option value="' + response_data[i].id + '">' + response_data[i].title + '</option>';
        }
        select_element.innerHTML = html
    }

    function show(ele) {
        var selected_option = document.getElementById('selected-option');
        selected_option.innerHTML = 'Selected Notification: <b>' + ele.options[ele.selectedIndex].text + '</b> </br>' +
            'ID: <b>' + ele.value + '</b>';
    }

    function trigger_notification() {
        var selected_option = document.getElementById('notification-dropdown').value;
        console.log("selected option = "+selected_option)
        return fetch('http://localhost:8000/notification-app/push-notification-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "notification_id": selected_option
            })
        })
    }
