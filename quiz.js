// Video Game Quiz Steps:
// 1. User Selects Answers
// -- A running total will be tallied up giving points to 'game'tags' dependant on answers
// -- This will also add to a total score for each game, depending on the 'game tags'
// 2. A Result is Displayed at the end based on their answers 
// -- A Score will be averaged / given a percentage based on their result / match
// -- Will display the game info from the Steam API
// -- Will display the game image + completetion time from the IGDB API

// Functionality:
// Only ONE answer can be given, not multiple choice
// Have the ability to go back and forth between questions
// Progress of the Quiz to be displayed i.e. question 1/5
// The ability to ask for a different game if the first choice is not acceptable / show all matches

    // USER VARIABLES //

    let questionState = 0;	//Keeps track of users place in quiz
	let quizActive = true;	//True until last question is answered

    let userStats =	[
        0,	//Red Dead Redemption 2
        0, 	//Dark Souls
        0, 	//God of War (2018)
        0, 	//Code Vein
        0, 	//Cuphead
        0,  //Undertale
        0,  //Vampire: The Masquerade - Bloodlines
        0,  //Resident Evil
        0,  //Baldur's Gate: Enhanced Edition
        0,  //Stardew Valley
        0,  //No Man's Sky
        0,  //Mass Effect 2
        0,  //Final Fantasy X
        0,  //The Elder Scrolls V: Skyrim
        0,  //Fallout 3
        0,  //Left 4 Dead
        0,  //Overcooked! 2
        0,  //Sid Meier's Civilization V
        0,  //Sonic Generations
        0 	//Assassin's Creed Origins
    ];

    let tempStats = userStats; //Holds stat increases relating to user selection

	// QUIZ VARIABLES //
	
	//Array containing all of the questions:

    const questionText =	[															
        "How old would you like the game to be based on its release date?", 	       //q1
        "What genre would you like the game to be?", 					               //q2
        "What type of setting would you like the game to have?", 	                   //q3
        "Which game mode would you like the game to have?", 				           //q4
        "Which graphic style would you like the game to have?", 			           //q5
        "How long would you like the game to be, in terms of average completion time?" //q6
    ];

    //Array containing all of the answers to questions:

    const answerText =	[		//question 1 answers													
							[	"2001-2005", 				
								"2006-2010", 
								"2011-2015",
								"2016-2020"],							
								
								//question 2 answers
							[	"Action",
                                "Adventure", 							
								"Arcade",
								"Horror",
								"Platformer",
								"Role-Playing (RPG)",
                                "Sci-Fi",
                                "Shooter",
                                "Simulator",
								"Strategy"],
								
								//question 3 answers
							[	"Cartoon", 
								"Fantasy",
								"Futuristic",
								"Historical",
								"Magic",
                                "Modern",
                                "Post-Apocalyptic",
                                "Space",
                                "Supernatural",
								"Western"],
								
								//question 4 answers
							[	"Single Player", 
								"Co-Operative",
								"Multiplayer"],
								
								//question 5 answers
							[	"Anime",
								"Cartoon",
                                "Pixel",
								"Realistic"],		

								//question 6 answers								
							[	"Short (0-10hrs)", 
								"Medium (11-50hrs)",
								"Long (51-100hrs",
								"Very Long (101+hrs)"]
						];
	
    //Arrays containing all game stat increments for each answer of all questions:
    const answerValues =	[	//question 1 answer values
							[	[0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0], 	//2001-2005
                                [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,1,0],	//2006-2010
								[0,1,0,0,0,0,1,0,1,1,0,0,0,0,1,0,0,0,0,1],  //2011-2015
								[1,0,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0]   //2016-2020
							],	
                            	//question 2 answer values
							[	[0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //action
                                [1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,0,0,0,0,1], //adventure
                                [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0], //arcade
                                [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0], //horror
                                [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], //platformer
                                [1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0], //rpg
                                [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0], //sci-fi
                                [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,1,0,0,0], //shooter
                                [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0], //simulator
                                [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0]  //strategy
                            ],
                            	//question 3 answer values
							[	[0,0,0,0,2,0,2,0,0,0,2,0,0,0,0,0,0,2,0,2], //cartoon
                                [0,2,2,0,2,0,2,0,0,2,0,0,0,2,2,0,0,0,0,0], //fantasy
                                [0,0,0,2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0], //futuristic
                                [2,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0], //historical
                                [0,2,2,0,0,0,0,0,0,2,0,0,0,2,2,0,0,0,0,0], //magic
                                [0,0,0,0,0,0,0,2,2,0,2,0,0,0,0,0,0,2,0,2], //modern
                                [0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0], //post-apoc
                                [0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0], //space
                                [0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0], //supernatural
                                [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  //western
                            ],
                            	//question 4 answer values
							[	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], //single
                                [1,1,0,1,1,0,0,0,0,1,1,1,0,0,0,0,1,1,0,0], //co-op
                                [1,1,0,1,1,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0]  //multi
                            ],
                            	//question 5 answer values
							[	[0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0], //anime
                                [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1], //cartoon
                                [0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0], //pixel
                                [1,1,1,0,0,1,0,1,1,1,0,1,1,0,1,1,1,0,1,0]  //realistic
                        ],
                        		//question 6 answer values
							[	[0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0], //short
                                [0,0,1,1,0,0,0,1,1,0,0,1,1,1,0,0,1,0,0,1], //medium
                                [1,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0], //long
                                [0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0]  //very long
                        ]
                    ];

    const results = document.getElementById("results");
	const quiz = document.getElementById("quiz");
	const body = document.body.style;
	const printResult = document.getElementById("topScore");
	const buttonElement = document.getElementById("button");
    const progressCounter = document.getElementById("progress-counter");
    const progressBarFull = document.getElementById("progress-bar-full");

    
    // QUIZ FUNCTIONALITY //

    buttonElement.addEventListener("click", changeState);	//Add click event listener to main button
	
	function changeState() {	//Progresses the user through the quiz						
		
		updateGameStats(); 	//Adds the values of the tempStats to the userStats										
		
		if (quizActive) {	//True as long as the user has not reached the end of the quiz
			
			initText(questionState);	//Sets up next question based on user's progress through quiz
			questionState++;			//Advances through quiz
			
			buttonElement.disabled = true; //Disables button until user chooses next answer
			buttonElement.innerHTML = "Please select an answer";			
			buttonElement.style.opacity = 0.7;
			
		} else { 	//If all questions have been answered

			setResultPage(); //Goes to result page
		}
	};


    function initText(question) {	//Determines question & answer content depending on progress					
		
		var answerSelection = ""; //Text variable containting HTML code for the radio buttons' content
		
		/* Creates radio buttons based on user progress through the quiz - current 'id' generation is not w3c compliant*/
		
		for (i = 0; i < answerText[question].length; i++) {		
			
			answerSelection += "<li><input type='radio' name='question" +
			(question+1) + "' onClick='setAnswer("+i+")' id='" + answerText[question][i] + "'><label for='" + answerText[question][i] + "'>" + answerText[question][i] + "</label></li>";
		}
		
		document.getElementById("questions").innerHTML = questionText[question];	//set question text
		document.getElementById("answers").innerHTML = answerSelection; //set answer text
        progressCounter.innerText = Math.floor(((questionState) / 6) * 100) + "%";	//sets the progress counter
        progressBarFull.style.width = `${(questionState / 6) * 100}%`; //sets the progress bar
	};


	
	function setAnswer(input) {     //When a user selects an answer, NOT when answer is submitted
				
		clearTempStats();		//Clear tempStats in case user reselects their answer
		
		tempStats = answerValues[questionState-1][input];	//selects game values based on user selection 
				
		if (questionState < questionText.length) { 	//True while the user has not reached the end of the quiz
			
			buttonElement.innerHTML = "Continue";
			buttonElement.disabled = false;
			buttonElement.style.opacity = 1;
					
		} else {  //All questions answered
			
			quizActive = false;
			buttonElement.innerHTML = "Show Results"
			buttonElement.disabled = false;
			buttonElement.style.opacity = 1;
		}
	};
	
	function clearTempStats() {   //Sets tempStats to 0
		
		tempStats = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];	
	};
	
	function updateGameStats() {    //Adds the values of the tempStats to the userStats based on user selection
		
		for (i = 0; i < userStats.length ; i++) {
			userStats[i] += tempStats[i];
		}
	};
	
	function setResultPage() { //Determines the highest video game value
		
		let highestStatPosition = 0;	//Highest stat defaults to first game 'Red Dead Redemption 2'
		
		for (i = 1 ; i < userStats.length; i++) { 	//Loops through all video game stats and updates highestStatPosition based on a highest score
			
			if (userStats[i] > userStats[highestStatPosition]) {
				highestStatPosition = i;
			}
		};
	
		displayResultPage(highestStatPosition); //Passes the index value of the highest stat discovered
		
		quiz.style.display = "none"; //Hides the quiz content, shows results content
	};
	

    function displayResultPage(game) {
        let valueAtGameIndex = userStats.at(game);
        let percentage = ` with a ${Math.floor(((questionState) / 7) * 100)}% match`;
		switch (game) {
			
			case 0:	//red dead redemption 2
				results.style.display = "inline-block";
				printResult.innerText = "Red Dead Redemption 2" + percentage;
				break;
				
			case 1:	//dark souls
				results.style.display = "inline-block";
				printResult.innerText = "Dark Souls" + percentage;
				break;
				
			case 2:	//God of War 2018
				results.style.display = "inline-block";
				printResult.innerText = "God of War (2018)" + percentage;
				break;
				
			case 3:	//Code Vein
				results.style.display = "inline-block";
				printResult.innerText = "Code Vein" + percentage;
				break;
				
			case 4:	//Cuphead
				results.style.display = "inline-block";
				printResult.innerText = "Cuphead" + percentage;
				break;
				
			case 5:	//Assassin's Creed Origins
				results.style.display = "inline-block";
				printResult.innerText = "Assassin's Creed Origins" + percentage;
				break;

            case 6:	//Undertale
				results.style.display = "inline-block";
				printResult.innerText = "Undertale" + percentage;
				break;

            case 7:	//Vampire: The Masquerade - Bloodlines
				results.style.display = "inline-block";
				printResult.innerText = "Vampire: The Masquerade - Bloodlines" + percentage;
				break;

            case 8:	//Resident Evil
				results.style.display = "inline-block";
				printResult.innerText = "Resident Evil" + percentage;
				break;

            case 9: //Baldur's Gate: Enhanced Edition
				results.style.display = "inline-block";
				printResult.innerText = "Baldur's Gate: Enhanced Edition" + percentage;
				break;

            case 10: //stardew valley
				results.style.display = "inline-block";
				printResult.innerText = "Stardew Valley" + percentage;
				break;

            case 11: //no mans sky
				results.style.display = "inline-block";
				printResult.innerText = "No Man's Sky" + percentage;
				break;

            case 12: //mass effect 2
				results.style.display = "inline-block";
				printResult.innerText = "Mass Effect 2" + percentage;
				break;

            case 13: //Final Fantasy X
				results.style.display = "inline-block";
				printResult.innerText = "Final Fantasy X" + percentage;
				break;

            case 14: //The Elder Scrolls V: Skyrim
				results.style.display = "inline-block";
				printResult.innerText = "The Elder Scrolls V: Skyrim" + percentage;
				break;

            case 15: //fallout 3
				results.style.display = "inline-block";
				printResult.innerText = "Fallout 3" + percentage;
				break;

            case 16: //left 4 dead
				results.style.display = "inline-block";
				printResult.innerText = "Left 4 Dead" + percentage;
				break;

            case 17: //overcooked 2
				results.style.display = "inline-block";
				printResult.innerText = "Overcooked! 2" + percentage;
				break;

            case 18: //Sid Meier's Civilization V
				results.style.display = "inline-block";
				printResult.innerText = "Sid Meier's Civilization V" + percentage;
				break;

            case 19: //sonic generations
				results.style.display = "inline-block";
				printResult.innerText = "Sonic Generations" + percentage;
				break;
				
			default: 
				document.getElementById("error").style.display = "inline-block";

		}
	};
	
