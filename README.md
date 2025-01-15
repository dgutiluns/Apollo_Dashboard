### Simplifying RPA Data with a Custom Analytics Dashboard
#### Design Overview and Challenges
During my internship at Apollo Studios, another intern and I were tasked with analyzing a database containing over 4 million entries to generate insights for both internal use and client purposes. Our initial challenge was to develop a script capable of analyzing the data, followed by producing analytics based on specific requirements set by the company and, in some cases, the client.

Additionally, we were responsible for setting up a scheduled, automated email system that would deliver personalized insights to clients regarding their RPAs. We were also asked to create a front-end software solution that could visually present the data and allow for customizable analysis.

To accomplish this, we began by creating a Python script to scrape the MongoDB database. We then developed a Flask-based Python backend and a React frontend, hosted on AWS, to provide clients and employees with customizable, accessible insights into the current status of their RPAs.

#### The Problem with Current Data Insights at Apollo Studios

Apollo Studios operated on a MongoDB database that was accessed through MongoDB Compass. This software was beneficial in searching for client names, bot names, and a time period, although it was very inaccessible to understand. The software also did not provide easy, comprehensive analysis that one could just glance at and understand the data. Both the client and executives at the company wanted a solution to this problem, whereupon customers could easily understand how their RPAs were performing, and the executives could isolate which areas they would like to work on. Overall, the main problem was accessible understanding of the database. It needed a clean, frontend interface.

#### Who is this made for?

Executive at Apollo Studios

Specifications: Understanding their company’s data, both on a high and low level
Challenges: Could not easily understand the MongoDB database without downloading software and going through an onboarding experience. 
Could not gain insight into a lot of data very quickly, as it required them to do long searches that didn’t provide comprehensive analysis. 
Was unable to easily see which bots were performing well or underperforming to figure out where work was needed.

Client

Specifications: Understanding how their RPA service is performing
Challenges: The client was forced to just accept data presented in inaccessible email formats, often in manually created spreadsheets. 
There was a lack of customization in the date ranges and individual bot insights. They also faced difficulty in quickly understanding the statuses and performance of their bots. 
They also were dependent on Apollo Studios to provide insights, rather than easily accessing them whenever.

#### Developing a Solution

The Backend:
We needed to first develop the python script that could analyze the MongoDB database. This involved some iterations in generating insights although this is irrelevant to the current design process.
Myself and one other intern developed a python script that could iterate through all of the data points in the MongoDB. It collected unique statuses and grouped them alongside generating aggregate data insights.

The Frontend:
We decided the front end should be accessed through a web browser, so clients need not download software. This led us to using React, as it was a great library for accessible and beautiful interfaces.
I decided to use React since I knew it best and it would be able to create beautiful frontend UI. I learned a lot about how difficult it can be to turn these design dreams into realities.

#### Main Takeaways
Design Takeaways

This was my first industry design experience. I learned what it meant to design in a team, and receive feedback from supervisors and peers.

I also learned how to design with a clear business objective. It was very enjoyable to have a clear problem and goal, and work my way to a solution.

Technical Takeaways

Empathy for your fellow developer. As I had to build anything I dreamt up, I learned what it takes to actually program something - and make sure it works in many edge cases. 

One of the most important design / technical mechanics I learned more about are micro interactions. They should be used sparingly, and only in places where they unexpectedly delight a user. And of course, don't make them impossible to code.
