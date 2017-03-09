
window.onload = function() {
								
		console.log("works");
		var global = new Object();
		global.serverUrl = "../serverScripts/geheim.php";

		$("#login-button").click(function() {

			var requestData = new Object();
			requestData.data = new Object();
			requestData.data.user     = $("#user").val();
			requestData.data.password = $("#password").val();
			
			$.getJSON(global.serverUrl,{data:JSON.stringify(requestData)
				}).done(function(data){
					console.log("response: "+data.toSource());
					
					if(data == "logged-in") {
						window.location.replace("index.html");
					}
					else {
						$("#user").html("");
						$("#password").html("");
						$("#info-box").html("<div style='color:red'> <i>Login fail. </i><br>Retry, amigo.</div>")
					}

				}).fail(function() {
					console.log("FEHLER");
				});
			});			
	};
