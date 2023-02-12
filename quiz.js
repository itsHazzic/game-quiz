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
								"2016-2020",],							
								
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
							[	[0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1], //cartoon
                                [0,1,1,0,1,0,1,0,0,1,0,0,0,1,1,0,0,0,0,0], //fantasy
                                [0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0], //futuristic
                                [1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0], //historical
                                [0,1,1,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0], //magic
                                [0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,1,0,1], //modern
                                [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0], //post-apoc
                                [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0], //space
                                [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0], //supernatural
                                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  //western
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

    // QUIZ FUNCTIONALITY //

    