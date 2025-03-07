const mockData = {
  "testId": "MOCK_TEST_001", // Added testId
  "testData": { // Wrapped the data inside 'testData'
    "sections": [
      {
        "sectionNumber": 0,
        "sectionTitle": "Fill-in-the-blank Example",
        "numberOfQuestions": 1,
        "texts": [
          {
            "textNumber": 1,
            "textType": "Library Notice",
            "textContent": "GREENFIELD COMMUNITY LIBRARY INFORMATION\n\nAll library books must be returned to the returns desk inside the library during opening times. For after-hours returns, please use the book drop box located to the right of the main entrance.\n\nOverdue books will incur a fee of $0.25 per day. Maximum fee is $10 per item.\n\nChildren's Story Time is held every Tuesday at 4:00 PM in the Children's Corner.\n\nThe Adult Book Club meets on the first Wednesday of each month at 6:30 PM.\n\nRegistration is needed for the Digital Skills Workshop held every Thursday.\n\nDamaged or lost books must be paid for at the replacement cost plus a $5 processing fee.\n\nThank you for your cooperation.",
            "questions": [
              {
                "questionType": "FILL_IN_THE_BLANKS",
                "questionStem": "Complete the sentences below using NO MORE THAN THREE WORDS from the text.",
                "items": [
                  {
                    "itemNumber": 1,
                    "questionPrompt": "Library books should be returned to the __________ inside the library during opening times.",
                    "correctAnswer": "returns desk"
                  },
                  {
                    "itemNumber": 2,
                    "questionPrompt": "Outside of opening hours, books can be returned using the book drop to the __________ of the main entrance.",
                    "correctAnswer": "right"
                  },
                  {
                    "itemNumber": 3,
                    "questionPrompt": "Children's Story Time is held every __________.",
                    "correctAnswer": "Tuesday"
                  },
                  {
                    "itemNumber": 4,
                    "questionPrompt": "The Adult Book Club meets on the first __________ of each month.",
                    "correctAnswer": "Wednesday"
                  },
                  {
                    "itemNumber": 5,
                    "questionPrompt": "Registration is needed for the __________ Skills Workshop.",
                    "correctAnswer": "Digital"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "sectionNumber": 1,
        "sectionTitle": "Social Survival",
        "numberOfQuestions": 9, // Updated to reflect the actual number of questions (5 TFNG + 4 Sentence Completion)
        "texts": [
          {
            "textNumber": 1,
            "textType": "Notice", // More specific text type
            "textContent": "GREENFIELD COMMUNITY LIBRARY\n\nNEW OPENING HOURS\nFrom Monday, April 3rd, 2023\n\nMonday to Friday: 9:00 AM - 7:00 PM\nSaturday: 10:00 AM - 5:00 PM\nSunday: Closed\n\nNEW SERVICES\n• Digital Media Lab: Access computers, scanners, and printers\n• Study Rooms: Book private study spaces (up to 2 hours)\n• Children's Corner: Story time every Tuesday at 4:00 PM\n• Language Exchange: Conversation groups in French (Mondays), Spanish (Wednesdays), and Mandarin (Thursdays) at 6:00 PM\n\nLIBRARY CARD RENEWAL\nPlease note that all library cards must be renewed annually. Bring proof of address and photo ID to the front desk. Online renewal is now available through our website: www.greenfieldlibrary.org\n\nBOOK BORROWING POLICY\n• Regular books: 3-week loan period (maximum 8 items)\n• New releases: 2-week loan period (maximum 2 items)\n• Reference materials: In-library use only\n• Digital resources: Access 24/7 through our online portal\n\nLate fees: $0.25 per day per item (maximum $10 per item)\nFees waived for seniors (65+) and children under 12\n\nFor more information, contact us at 555-123-4567 or info@greenfieldlibrary.org",
            "questions": [
              {
                "questionType": "TRUE_FALSE_NOT_GIVEN",
                "questionStem": "Do the following statements agree with the information given in the text? Write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
                "answer": null, // Not needed, answers are within item
                "paragraphHeadings": null, // Not applicable
                "headingOptions": null, // Not applicable
                "paragraphMatches": null, // Not applicable
                "options": null, //Not applicable
                "correctAnswer": null, //Not applicable
                "items": [
                  {
                    "itemNumber": 1,
                    "questionPrompt": "The library is open every day of the week.",
                    "correctAnswer": "FALSE" // Direct answer
                  },
                  {
                    "itemNumber": 2,
                    "questionPrompt": "Library cards need to be renewed every two years.",
                    "correctAnswer": "FALSE"
                  },
                  {
                    "itemNumber": 3,
                    "questionPrompt": "You can borrow a maximum of 10 items at once.",
                    "correctAnswer": "NOT_GIVEN"
                  },
                  {
                    "itemNumber": 4,
                    "questionPrompt": "Senior citizens don't have to pay late fees.",
                    "correctAnswer": "TRUE"
                  },
                  {
                    "itemNumber": 5,
                    "questionPrompt": "The library offers free internet access.",
                    "correctAnswer": "NOT_GIVEN"
                  }
                ]
              },
              {
                "questionType": "SENTENCE_COMPLETION",
                "questionStem": "Complete the sentences below. Choose NO MORE THAN THREE WORDS AND/OR A NUMBER from the text for each answer.",
                "answer": null, // Not needed
                "paragraphHeadings": null, // Not applicable
                "headingOptions": null, // Not applicable
                "paragraphMatches": null, // Not applicable
                "options": null, //Not applicable
                "correctAnswer": null, //Not applicable
                "items": [
                  {
                    "itemNumber": 1,
                    "questionPrompt": "Story time events for children take place on ____________.",
                    "correctAnswer": "Tuesday"
                  },
                  {
                    "itemNumber": 2,
                    "questionPrompt": "Private study spaces can be booked for a maximum of ____________.",
                    "correctAnswer": "2 hours"
                  },
                  {
                    "itemNumber": 3,
                    "questionPrompt": "For regular books, the loan period is ____________.",
                    "correctAnswer": "3-week"
                  },
                  {
                    "itemNumber": 4,
                    "questionPrompt": "The maximum late fee per item is ____________.",
                    "correctAnswer": "$10"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "sectionNumber": 2,
        "sectionTitle": "Workplace Survival",
        "numberOfQuestions": 1, // Corrected number of questions
        "texts": [
          {
            "textNumber": 2,
            "textType": "Policy", // More specific text type
            "textContent": "SILVERTECH INDUSTRIES\nREMOTE WORK POLICY AND GUIDELINES\nEffective: January 15, 2023\n\nA. INTRODUCTION\nSilverTech Industries recognizes the growing importance of flexible work arrangements. This policy outlines the expectations and procedures for remote work to ensure productivity, collaboration, and work-life balance.\n\nB. ELIGIBILITY\nRemote work arrangements are available to employees whose job responsibilities can be performed effectively outside the office environment. Eligibility is determined by department managers based on job requirements, employee performance, and business needs. New employees may be required to complete a 90-day in-office orientation period before becoming eligible for remote work.\n\nC. WORK SCHEDULE AND AVAILABILITY\nRemote employees must:\n• Maintain their regular work schedule (40 hours/week) unless otherwise approved\n• Be available during core business hours (10:00 AM - 3:00 PM local time)\n• Attend scheduled virtual meetings regardless of time zone differences\n• Respond to emails and messages within 2 business hours\n• Update their status on company communication platforms\n• Request time off through the standard procedures\n\nD. TECHNOLOGY AND EQUIPMENT\nThe company will provide:\n• Laptop computer\n• Basic productivity software\n• Security tools (VPN, antivirus)\n\nEmployees are responsible for:\n• Reliable internet connection (minimum 20 Mbps)\n• Ergonomic workspace setup\n• Secure work environment free from distractions\n\nThe IT department will provide remote technical support during business hours. Equipment malfunctions should be reported immediately.\n\nE. INFORMATION SECURITY\nRemote employees must:\n• Use company-provided VPN for all work activities\n• Secure confidential information from unauthorized access\n• Lock computers when not in use\n• Use only approved cloud storage solutions\n• Report security incidents immediately\n• Complete quarterly security awareness training\n\nF. PERFORMANCE EXPECTATIONS\nPerformance will be measured based on output and achievement of goals rather than hours logged. Managers will conduct weekly check-ins and quarterly performance reviews. Remote employees are expected to maintain or exceed their previous productivity levels.\n\nG. COMMUNICATION PROTOCOLS\nRemote employees should:\n• Check in with their team at the beginning of each workday\n• Participate actively in virtual meetings (camera on when possible)\n• Document discussions and decisions in shared workspaces\n• Use appropriate communication channels based on urgency\n\nH. TERMINATION OF REMOTE WORK ARRANGEMENT\nRemote work privileges may be modified or revoked if:\n• Business needs change\n• Performance declines\n• Policy violations occur\n• Security incidents arise\n\nTwo weeks' notice will be provided when possible before requiring a return to office-based work.\n\nI. LEGAL CONSIDERATIONS\nEmployees working remotely must adhere to all company policies, including those related to confidentiality, data protection, working hours, and professional conduct. Workers' compensation coverage applies to job-related injuries that occur in the designated home office space during working hours.\n\nThis policy will be reviewed annually to ensure it meets the evolving needs of our organization.",
            "questions": [
              {
                "questionType": "MATCHING_HEADINGS",
                "questionStem": "The reading passage has nine paragraphs, A-I. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, i-xi, next to paragraphs A-I.",
                "answer": null, // Not needed, answers are within items
                "paragraphHeadings": [
                  {
                    "paragraphNumber": 1,
                    "correctHeading": "Purpose and Scope"
                  },
                  {
                    "paragraphNumber": 2,
                    "correctHeading": "Qualification Requirements"
                  },
                  {
                    "paragraphNumber": 3,
                    "correctHeading": "Time Management Rules"
                  },
                  {
                    "paragraphNumber": 4,
                    "correctHeading": "Hardware and Software Provisions"
                  },
                  {
                    "paragraphNumber": 5,
                    "correctHeading": "Data Protection Requirements"
                  },
                  {
                    "paragraphNumber": 6,
                    "correctHeading": "Key Performance Indicators"
                  },
                  {
                    "paragraphNumber": 7,
                    "correctHeading": "Team Interaction Guidelines"
                  },
                  {
                    "paragraphNumber": 8,
                    "correctHeading": "Conditions for Policy Changes"
                  },
                  {
                    "paragraphNumber": 9,
                    "correctHeading": "Regulatory and Policy Compliance"
                  }
                ],
                "headingOptions": [
                  "Purpose and Scope",
                  "Qualification Requirements",
                  "Time Management Rules",
                  "Hardware and Software Provisions",
                  "Data Protection Requirements",
                  "Key Performance Indicators",
                  "Team Interaction Guidelines",
                  "Conditions for Policy Changes",
                  "Regulatory and Policy Compliance",
                  "Office Space Requirements",
                  "Implementation Timeline"
                ],
                "paragraphMatches": null, // Not applicable
                "options": null, //Not applicable
                "correctAnswer": null, //Not applicable
                "items": [ //This part can be removed if you are using paragraphHeadings array
                  {
                    "itemNumber": 1,
                    "questionPrompt": "Paragraph A",
                    "correctAnswer": "Purpose and Scope"
                  },
                  {
                    "itemNumber": 2,
                    "questionPrompt": "Paragraph B",
                    "correctAnswer": "Qualification Requirements"
                  },
                  {
                    "itemNumber": 3,
                    "questionPrompt": "Paragraph C",
                    "correctAnswer": "Time Management Rules"
                  },
                  {
                    "itemNumber": 4,
                    "questionPrompt": "Paragraph D",
                    "correctAnswer": "Hardware and Software Provisions"
                  },
                  {
                    "itemNumber": 5,
                    "questionPrompt": "Paragraph E",
                    "correctAnswer": "Data Protection Requirements"
                  },
                  {
                    "itemNumber": 6,
                    "questionPrompt": "Paragraph F",
                    "correctAnswer": "Key Performance Indicators"
                  },
                  {
                    "itemNumber": 7,
                    "questionPrompt": "Paragraph G",
                    "correctAnswer": "Team Interaction Guidelines"
                  },
                  {
                    "itemNumber": 8,
                    "questionPrompt": "Paragraph H",
                    "correctAnswer": "Conditions for Policy Changes"
                  },
                  {
                    "itemNumber": 9,
                    "questionPrompt": "Paragraph I",
                    "correctAnswer": "Regulatory and Policy Compliance"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "sectionNumber": 3,
        "sectionTitle": "General Interest",
        "numberOfQuestions": 2, // Corrected number of questions
        "texts": [
          {
            "textNumber": 1,
            "textType": "Magazine Article", // More specific text type
            "textContent": "A. In certain regions around the world, people live markedly longer, healthier lives compared to the global average. These areas, dubbed \"Blue Zones\" by researcher Dan Buettner and a team of demographers who identified them in the early 2000s, have been studied extensively to understand the factors contributing to their residents' exceptional longevity. With citizens regularly living active lives past 100 years, these communities offer important insights about lifestyle, diet, and social practices that promote not just extended lifespans but enhanced quality of life in older age.\n\nB. The term \"Blue Zones\" originated from the blue circles researchers drew around these longevity hotspots on world maps. Five primary Blue Zones have been identified: Ikaria (Greece), Okinawa (Japan), Ogliastra, Sardinia (Italy), Nicoya Peninsula (Costa Rica), and Loma Linda, California (USA). Despite being scattered across different continents and cultures, these communities share surprising similarities in lifestyle practices, suggesting universal principles for healthy aging that transcend geographic and cultural boundaries.\n\nC. Perhaps the most extensively studied dietary pattern among Blue Zone inhabitants is the Mediterranean diet predominant in Ikaria and Sardinia. This diet centers around abundant plant foods, including vegetables, fruits, whole grains, and legumes, with olive oil as the primary fat source. Animal products are consumed in moderation, with fish featured more prominently than meat. Meanwhile, Okinawans traditionally follow a plant-rich diet with the principle of \"hara hachi bu\"—eating until only 80% full. Across all Blue Zones, meals are typically prepared at home from whole, unprocessed ingredients, with minimal added sugars or refined carbohydrates. Importantly, food is viewed not merely as fuel but as a central component of social interaction and cultural heritage.\n\nD. Physical activity is seamlessly integrated into daily life in Blue Zones, contrasting sharply with the compartmentalized exercise routines common in Western societies. Rather than driving to fitness centers for scheduled workouts, Blue Zone residents engage in natural movement throughout their day. Gardening, walking, and manual household tasks keep their bodies in motion. In Sardinia, many centenarians worked as shepherds, walking miles daily across mountainous terrain. Okinawans often garden well into their 90s, and Nicoyan elders regularly walk to visit neighbors. These activities provide consistent low-intensity exercise that maintains cardiovascular health, muscle strength, and joint mobility without creating undue stress on aging bodies.\n\nE. Strong social connections represent another crucial element of Blue Zone living. Multi-generational households are common, with elders playing vital roles in family and community life. In Okinawa, older adults form \"moais\"—social support groups of five or more friends who commit to each other for life, providing emotional support during difficult times and sharing life's celebrations. Research shows that such close social ties correlate strongly with reduced rates of depression, cognitive decline, and stress-related diseases. The sense of belonging and purpose that comes from community integration appears to generate powerful protective effects against many age-related ailments.\n\nF. The concept of purpose—or \"ikigai\" in Okinawa and \"plan de vida\" in Nicoya—emerges as another critical factor in Blue Zone longevity. Having a clear reason to wake up each morning contributes significantly to psychological well-being and appears to extend lifespan. Blue Zone centenarians rarely \"retire\" in the Western sense of ceasing productive activity. Instead, they continue contributing to their communities through work, mentorship, childcare, or other meaningful pursuits adapted to their capabilities. This ongoing engagement provides mental stimulation, a sense of identity, and social connection—all factors linked to cognitive health and emotional resilience.\n\nG. Stress management practices feature prominently in Blue Zone lifestyles, albeit in culturally specific forms. Ikarians take regular afternoon naps, Sardinians enjoy happy hour with friends and neighbors, and Seventh-day Adventists in Loma Linda observe a weekly day of rest. Okinawans practice mindful moments throughout the day, taking time to remember ancestors and express gratitude. Rather than pursuing complex stress-reduction techniques, these communities have woven simple, sustainable stress-relief practices into their cultural fabric, allowing for regular recovery from life's inevitable challenges.\n\nH. The final pillar of Blue Zone lifestyle involves community engagement, often centered around spiritual practices. While specific religious beliefs vary across regions, participation in faith-based communities appears consistently beneficial. Research indicates that regular attendance at religious services—regardless of denomination—correlates with longer lifespan. These communities provide social support, encourage healthy behaviors, promote contemplative practices, and often foster volunteer opportunities. Additionally, most spiritual traditions emphasize virtues like gratitude, forgiveness, and compassion, which research associates with improved mental health outcomes.\n\nI. As modern medical science continues advancing treatments for age-related diseases, the Blue Zone phenomenon reminds us that many keys to longevity lie not in sophisticated medical interventions but in lifestyle practices within reach of most people. The challenge lies in implementing these principles within contemporary societies structured around convenience, consumption, and digital connectivity rather than physical activity, social cohesion, and connection to natural environments. Some communities and organizations have begun applying Blue Zone principles through policy changes, infrastructure improvements, and community programs designed to make healthy choices more accessible and appealing.\n\nJ. Critics note that genetics likely plays some role in Blue Zone longevity, potentially limiting the universal applicability of these lifestyle lessons. However, research suggests that genes account for only about 20-30% of longevity determinants, with environment and lifestyle responsible for the remainder. Additionally, some Blue Zones are seeing younger generations abandon traditional practices as globalized food systems and technologies spread, resulting in increasing rates of chronic diseases previously rare in these regions. This trend underscores the notion that Blue Zone benefits derive from actual lifestyle practices rather than simply geographic location or genetic heritage.",
            "questions": [
              {
                "questionType": "MULTIPLE_CHOICE",
                "questionStem": "Choose the correct letter, A, B, C, or D.",
                "answer": null, // Not needed, answers are within items
                "paragraphHeadings": null, // Not applicable
                "headingOptions": null, // Not applicable
                "paragraphMatches": null, // Not applicable
                "options": [
                  "It refers to coastal areas with blue waters where people live longer",
                  "It comes from the blue ink researchers used on maps",
                  "It represents the calm, 'blue' state of mind of residents",
                  "It signifies areas with high oxygen levels appearing blue from space"
                ],
                "correctAnswer": "It comes from the blue ink researchers used on maps",
                "items": [
                  {
                    "itemNumber": 1,
                    "questionPrompt": "What was the origin of the term 'Blue Zones'?",
                    "correctAnswer": "B"
                  },
                  {
                    "itemNumber": 2,
                    "questionPrompt": "Which of the following is NOT mentioned as a Blue Zone?",
                    "options": [
                      "Loma Linda, California",
                      "Ikaria, Greece",
                      "Hokkaido, Japan",
                      "Nicoya Peninsula, Costa Rica"
                    ],
                    "correctAnswer": "C"
                  },
                  {
                    "itemNumber": 3,
                    "questionPrompt": "According to the passage, how do Blue Zone residents typically approach physical activity?",
                    "options": [
                      "By following structured exercise routines at fitness centers",
                      "By limiting physical activity to prevent injury in old age",
                      "By incorporating movement naturally throughout daily activities",
                      "By performing high-intensity interval training"
                    ],
                    "correctAnswer": "C"
                  },
                  {
                    "itemNumber": 4,
                    "questionPrompt": "What does the Okinawan principle of 'hara hachi bu' mean?",
                    "options": [
                      "Eating only plant-based foods",
                      "Eating until 80% full",
                      "Sharing food with eight family members",
                      "Fasting one day per week"
                    ],
                    "correctAnswer": "B"
                  },
                  {
                    "itemNumber": 5,
                    "questionPrompt": "What percentage of longevity factors are attributed to genetics according to the passage?",
                    "options": [
                      "50-60%",
                      "70-80%",
                      "20-30%",
                      "5-10%"
                    ],
                    "correctAnswer": "C"
                  }
                ]
              },
              {
                "questionType": "PARAGRAPH_MATCHING",
                "questionStem": "The reading passage has ten paragraphs, A-J. Which paragraph contains the following information? Write the correct letter, A-J, next to questions 1-7.",
                "answer": null, // Not needed
                "paragraphHeadings": null, // Not applicable
                "headingOptions": null, // Not applicable
                "paragraphMatches": [
                  {
                    "statementNumber": 1,
                    "correctParagraph": "G"
                  },
                  {
                    "statementNumber": 2,
                    "correctParagraph": "C"
                  },
                  {
                    "statementNumber": 3,
                    "correctParagraph": "H"
                  },
                  {
                    "statementNumber": 4,
                    "correctParagraph": "J"
                  },
                  {
                    "statementNumber": 5,
                    "correctParagraph": "E"
                  },
                  {
                    "statementNumber": 6,
                    "correctParagraph": "D"
                  },
                  {
                    "statementNumber": 7,
                    "correctParagraph": "I"
                  }
                ],
                "options": null, //Not applicable
                "correctAnswer": null, //Not applicable
                "items": [
                  {
                    "itemNumber": 1,
                    "questionPrompt": "An explanation of how Blue Zone residents typically handle stress",
                    "correctAnswer": "G"
                  },
                  {
                    "itemNumber": 2,
                    "questionPrompt": "A description of how Blue Zone diets typically differ from Western eating patterns",
                    "correctAnswer": "C"
                  },
                  {
                    "itemNumber": 3,
                    "questionPrompt": "A reference to the role of religious practices in promoting longevity",
                    "correctAnswer": "H"
                  },
                  {
                    "itemNumber": 4,
                    "questionPrompt": "A mention of issues facing younger generations in traditional Blue Zone regions",
                    "correctAnswer": "J"
                  },
                  {
                    "itemNumber": 5,
                    "questionPrompt": "An explanation of social support groups in Okinawa",
                    "correctAnswer": "E"
                  },
                  {
                    "itemNumber": 6,
                    "questionPrompt": "A comparison between Blue Zone physical activity and Western exercise routines",
                    "correctAnswer": "D"
                  },
                  {
                    "itemNumber": 7,
                    "questionPrompt": "A discussion of how modern communities are trying to apply Blue Zone principles",
                    "correctAnswer": "I"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

export default mockData;