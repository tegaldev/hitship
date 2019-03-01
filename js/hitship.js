// Spielfeld erzeugen
		// Alle Reihen und Zeilen für das Spielbrett Spieler 1
		var rows = 10;
		var cols = 10;
		var ocols = 11;
		var orows = 10;
		var squareSize = 45;

		// Auswahl des divcontainers spielBrett
		var spielBrettContainer = document.getElementById("spielBrett");
		// Das Spielbrett erzeugen mit Anordnung
		
		// outer Spielfeld
		outdiv = document.createElement("div");
		spielBrettContainer.appendChild(outdiv);
		outdiv.id = 'letternumber';
		
		var letter = [ "","A","B","C","D","E","F","G","H","I","J" ]
		for (var x = 0; x < ocols; x++) 
		{
		outsquarecol = document.createElement("div");
		outdiv.appendChild(outsquarecol);

				// Jedem Element eine id geben im Bezug auf Ihre Anordnung, Bsp. "outf0-10"
				outsquarecol.id = 'out';		

				// Die Div Elemente die Buchstaben zuweisen
				outsquarecol.innerHTML = (letter[x]);
				
				// Setzen der Koordinaten eines jeden Rasterfeldes: Vervielfachen der aktuellen Zeilen- oder Spaltennummer 
				var leftPosition = x * squareSize;			
				
				// Positioniertung über CSS mit absolute
				outsquarecol.style.top = topPosition + 'px';
				outsquarecol.style.left = leftPosition + 'px';
		
		}
		var numbers = ["1","2","3","4","5","6","7","8","9","10"]
		for ( var y = 0; y < orows ; y++) 
		{
		outsquarerow = document.createElement("div");
		outdiv.appendChild(outsquarerow);

				// Jedem Element eine id geben im Bezug auf Ihre Anordnung, Bsp. "outf0-10"
				outsquarerow.id = 'out';

				// Die Div Elemente die Buchstaben zuweisen
				outsquarerow.innerHTML = (numbers[y]);
				
				// Setzen der Koordinaten eines jeden Rasterfeldes: Vervielfachen der aktuellen Zeilen- oder Spaltennummer 
				var topPosition = y * squareSize;		
				
				// Positioniertung über CSS mit absolute
				outsquarerow.style.top = topPosition + squareSize + 'px';
				//outsquare.style.left = leftPosition + 'px';	
		
		}
		
		// inner Spielfeld
		indiv = document.createElement("div");
		spielBrettContainer.appendChild(indiv);
		indiv.id = 'spielBereich';
		
		for ( var i = 0; i < cols; i++) 
			{
				for (var j = 0; j < rows; j++) 
				{
					// Div html dokumente erzeugen
					square = document.createElement("div");
					indiv.appendChild(square);

					// Jedem Element eine id geben im Bezug auf Ihre Anordnung, Bsp. "s00"
					square.id = 's' + j + i;		
					// Setzen der Koordinaten eines jeden Rasterfeldes: Vervielfachen der aktuellen Zeilen- oder Spaltennummer 
					var topPosition = j * squareSize;
					var leftPosition = i * squareSize;			
					
					// Positioniertung über CSS mit absolute
					square.style.top = topPosition + squareSize + 'px';
					square.style.left = leftPosition + squareSize + 'px';						
				}
			}

		
		//Es müssen 17 hit's (Treffer) gelandet werden um das Spiel zu schaffen
		//var	Carrier = 5 hits [1,1,1,1,1]
		//var	Battleship = 4 hits [1,1,1,1]
		//var	Destroyer = 3 hits [1,1,1]
		//var Submarine = 3 hits [1,1,1]
		//var	PatrolBoat = 2 hits [1,1]

		
		// Variablen für die Torpedos bzw. Klicks
		
		var hitCount = 0;
		var torpedoCount = 0;
		var torpedobox = document.getElementById("torpedos");
		var infobox = document.getElementById("infos")
		var torpedos = 50; // So Viel Schuss hat der Spieler
		var curentPlacement;
		var random10 = Math.floor((Math.random() * 10) + 1);
		
		function trefferverf() {
		var textschuss = document.createTextNode("Du hast " + torpedos + " Treffer zur Verfügung");
		torpedobox.appendChild(textschuss);
		}
         
			
		// Aufbau der Flotte	
		
		/* Mit disem 2D Array werden die Schiffe platziert. Dieses muss noch
		automatisiert und zur manuellen Eingabe der Schiffe gebracht werden.
		Random Knopf für das durchmischen.

		   0 = empty, 1 = Schiffsteil, 2 = gesunkenes Schiffsteil, 3 = daneben geschossen
		*/
		var spielBrett = [
						[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0,0,0,0]
						]
			
		// Random Knopf
		
		var mischen = document.getElementById("mischen").addEventListener("click", mixen);
		
		//-------Erschafft die Flotte------------
		
		// Generiert die Schiffkoordinaten für die fünf Schiffe als Objekte in einem Array mit Länge https://javascript.info/class
		// wenn ein Platz schon belegt ist, wird ein neues Schiff generiert.
		class Ship 
		{
		  constructor(name, start, end) 
		  {
			this.name = name;
			this.spots = [];
			//console.log(this.spots);
			if (start.y == end.y) 
			{
			  for (var i = start.x; i <= end.x; i++) 
			  {
				this.spots.push({x: i, y: start.y});
			  }
			} else 
			{
			  for (var i = start.y; i <= end.y; i++) 
			  {
				this.spots.push({x: start.x, y: i})
			  }
			}
		  }
		}
		
		
		function mixen()
		{

			// Startet die Schwierigkeitsgradsauswahl
			changehard()
			
			// Generiert die Schiffe und setzt sie in ein Array

			//Array mit 10 x 10 Feldern
			var self = this;
			this.spielbereich = [];
			for (var i = 0; i < 10; i++) 
			{
			  this.spielbereich.push(new Array(10).fill(0));
			}
			this.ships = [];

			// Random Platzierung und Zuordnung horizontal und vertikal
			// Erstellt ein Array mit x und y koordinaten für ein mögliches Setzen (spots)
			function placeRandom(length) 
			{
				var randomX = -5;
				var randomY = -5;
				while (randomX+length < 0 || randomX+length > 9 || randomY+length < 0 || randomY+length > 9) 
				{
				  randomX = Math.floor(Math.random() * 10); // Random Zahl zwischen 0 und 9
				  randomY = Math.floor(Math.random() * 10);
				}
				var randomDir = Math.random() < 0.5 ? "H" : "V";
				var ship;
				if (randomDir == "V") 
				{
				  ship = new Ship({ship: length+1}, {x: randomX, y: randomY}, {x: randomX, y: randomY+length});
				  
				} else 
				{
				  ship = new Ship({ship: length+1}, {x: randomX, y: randomY}, {x: randomX+length, y: randomY});
				}
				//console.log(ship)
				// Prüft ob der Bereich bereits besetzt wurde.
				var spotisValid = true
				ship.spots.forEach(spot => 
				{
				  if (self.spielbereich[spot.x][spot.y] != 0) 
				  {
					spotisValid = false;
				  }
				});

				if (spotisValid) {
				  self.ships.push(ship);
				  ship.spots.forEach(spot => 
				  {
					self.spielbereich[spot.x][spot.y] = 1;
				  });
				}
				return spotisValid;
			}
		
			//Spielbereich wird generiert / Länge wird angerechnet 
			// Merke die Länge der Schiffe von 5,4,3,3,2  muss -1 gesetzt werden.
			var stockShips = [4,3,2,2,1];
			stockShips.forEach(length => 
			{
			  var happened;
			  do 
			  {
				happened = placeRandom(length);
			  } 
			  while (!happened)
			});
			var count = 0;
			this.spielbereich.forEach(row => row.forEach(coord => {
			  if (coord == 1) { count++; }
			}));
			//console.log(this.spielbereich);
			spielBrett = this.spielbereich;
		}
		

		// Erst müssen die Schiffe gesetzt werden Info Meldung
		// Sperrbox
		
		function sperrbox() 
		{
			overdiv = document.createElement("div");
			spielBrettContainer.appendChild(overdiv);
			overdiv.id = 'sperrbox';
			
			overdiv.addEventListener("click", firstShipsInfo);
			
			function firstShipsInfo () 
			{
				infobox.innerHTML = "Bitte starte erst das Spiel";
				infobox.style.color = "#fff533";
				setTimeout(function(){ 
				infobox.innerHTML = "";
				}, 1000);
			}
		}
		document.onload = sperrbox();
		
		// Löscht die SperrBox
		function deletesperr() {
			var exist = document.getElementById("sperrbox")
			if(exist)
			{
			spielBrettContainer.removeChild(overdiv);
			}
			}
		
		// Popupbox Schwierigkeitsgrad
		function changehard()
		{
			var popup = document.getElementById("popup");
			var mode = document.createElement("div");
			popup.appendChild(mode);
			mode.classList.add("mode");
			
			//EasyButton
			var easy = document.createElement("button");
			mode.appendChild(easy);
			easy.classList.add("buttonst");
			var easyt = document.createTextNode("EASY");
			easy.appendChild(easyt);
			easy.addEventListener("click", funkeasy);
			function funkeasy () 
			{
				modeget = document.getElementById("mode");
				mode.id = 'remove';
				torpedos = 55;
				trefferverf()
				deletesperr()
				document.getElementById('mischen').removeEventListener("click", mixen);
				document.getElementById('mischen').classList.add("grey");
			}
			
			//NormalButton
			var normal = document.createElement("button");
			mode.appendChild(normal);
			normal.classList.add("buttonst");
			var normalt = document.createTextNode("NORMAL");
			normal.appendChild(normalt);
			normal.addEventListener("click", funknormal);
			function funknormal () 
			{
				modeget = document.getElementById("mode");
				mode.id = 'remove';
				torpedos = 50;
				trefferverf()
				deletesperr()
				document.getElementById('mischen').removeEventListener("click", mixen);
				document.getElementById('mischen').classList.add("grey");
			}
			
			//HardButton
			var hard = document.createElement("button");
			mode.appendChild(hard);
			hard.classList.add("buttonst");
			var hardt = document.createTextNode("HARD");
			hard.appendChild(hardt);
			hard.addEventListener("click", funkhard);
			function funkhard () 
			{
				modeget = document.getElementById("mode");
				mode.id = 'remove';
				torpedos = 42;
				trefferverf()
				deletesperr()
				document.getElementById('mischen').removeEventListener("click", mixen);
				document.getElementById('mischen').classList.add("grey");
			}
		}
		
		// Reset vom Spiel
		var reset = document.getElementById("reset")
		reset.addEventListener("click", resetgame);
		
		window.onload = function() {
			var reloading = sessionStorage.getItem("reloading");
			if (reloading) {
				sessionStorage.removeItem("reloading");
				mixen();
			}
		}
		
		function resetgame() 
		{
		sessionStorage.setItem("reloading", "true");
		document.location.reload();
		infobox.innerHTML = "ResetGame";
		infobox.style.color = "#fff533";
		}
		
		function reloadwindow()	
		{
		document.location.reload();
		
		function fadeOut(el){
			  el.classList.add('hide');
			  el.classList.remove('show');
			}
			
			fadeOut(windiv);
		}
		
		// Popupscreen beim Gewinnen des Spiels
		function popupscreen() 
		{
		var popup = document.getElementById("popup")
		var windiv = document.createElement("div");
		var firework = document.createElement("div");
		var firework2 = document.createElement("div");
		var headline = document.createElement("h1");
		var text = document.createTextNode("DU HAST GEWONNEN");
		var outtext = document.createElement("p")
		var text2 = document.createTextNode("click me");
		popup.appendChild(windiv);
		windiv.appendChild(firework);
		windiv.appendChild(firework2);
		windiv.appendChild(headline);
		windiv.appendChild(outtext)
		headline.appendChild(text);
		outtext.appendChild(text2);
		firework.classList.add("firework");
		firework2.classList.add("firework");
		firework.id = 'position';
		firework2.id = 'position2';
		headline.id = 'win';
		windiv.id = 'windiv';
		outtext.id = 'outtext';
		windiv.addEventListener("click", reloadwindow);
		windiv = document.getElementById("windiv")
		
		//Scoreeingabe mit Bestenliste noch anfügen
		}

		// onClick Event für jedes div auf dem Spielbrett um damit zu interagieren
		indiv.addEventListener("click", fireTorpedo, false);
		

		// Code um die Torpedos zu verschießen
		function fireTorpedo(mun) 
		{  
		
			if (torpedoCount < torpedos)
			{
			
				// Wenn die div Box geklickt wird, bzw. der Torpedo abgeschossen wird passiert folgendes:
				// Es wird geprüft ob das aktuelle Target schon geklickt wurde.
				if (mun.target !== mun.currentTarget)
				{
					// Extraktion von Zeile und Spalte der ID des HTML -Elements Bsp. "s00" zweiter und dritter wert
					var row = mun.target.id.substring(1,2);
					var col = mun.target.id.substring(2,3);
					//alert("Clicked on row " + row + ", col " + col);
							
					// Wenn der Spieler ein Feld klickt auf dem sich kein Schiff befindet, ändert Farbe
					if (spielBrett[row][col] === 0) 
					{
						mun.target.style.background = '#bbb';
						// er setzt den Wert auf 3 dass angegeben wird, dass er vorbei geschossen hat
						spielBrett[row][col] = 3;
						
					// Wenn der Spieler ein Schiff trifft, ändert Farbe
					} else if (spielBrett[row][col] === 1) 
						{
							mun.target.style.background = 'rgba(61, 200, 255, 1)';
							// er setzt den Wert auf 2 dass angegeben wird, dass er getroffen hat.
							spielBrett[row][col] = 2;
							
							// Zählt die Treffer und Beendet das Spiel
							hitCount++;
							if (hitCount === 17) 
							{
								infobox.innerHTML = "Alle gegnerischen Schiffe wurden ausgeschaltet. Du gewinnst!";
								document.getElementById("infos").style.color = "#fff533";
								popupscreen();
								windiv.classList.add('show');
							}
							//console.log(hitCount);
						
							// Wenn der Spieler auf ein bereits beschossenes Feld klickt info Meldung
						} 	else if (spielBrett[row][col] > 1) 
							{
								infobox.innerHTML = "Verbrauch deine Torpedos nicht, das Feld wurde schon unter Beschuss genommen";
								document.getElementById("infos").style.color = "#fff533";
								setTimeout(function(){ 
								infobox.innerHTML = "";
								}, 1000);
								
							}
						mun.stopPropagation();
				}
				
			}
			else
				{
					infobox.innerHTML = "Schade, du hast verloren";
					document.getElementById("infos").style.color = "#fff533";
				}
            	
            torpedoCount++;
            var torpedoabzug = torpedos - torpedoCount;
			//console.log (torpedoabzug);
			if (torpedoabzug > 0)
			{
				torpedobox.innerHTML = "Du hast noch " + torpedoabzug + " Treffer zur Verfügung"
			}
			else 
			{
				torpedobox.innerHTML = "Du hast noch " + 0 + " Treffer zur Verfügung"
			}
			//Finde die Schiffe und bezeichne Sie
			//Wird noch gemacht
			function Shipcount()
			{
				console.log(ship.name);
			}
		}
		
        