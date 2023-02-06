-how to install and start the project. 
Clone the repository into your computer and open view.html file. No further steps required, the project should run instantly. 

- what has been done, what technical decisions have been taken
1. There will be an input for the username of the Github user. ---DONE
2. You will load some info about this username (image, name, description) and also their public gists. ---DONE
3. Their gists will be loaded with :
1) their title, date of creation; ----DONE
2) their programming language as a colored badge; ----DONE
3) a list of their forks and the users that forked them. ---DONE ( on mouse over nr of forks you can see the user that forked them and on click
you will be redirected to specific fork)

4. On click, the gist will be loaded in a syntax-highlighted code viewer. - ALMOST DONE 
5. Optimize the page for performance. - out of time.

For further optimisation the code needs to be re designed in a way that much less HTML content is generated dynamically and we only replace the values in the page. 
Such changes would also fix highlighting issues as right now I have a conflict between dynamic content and highlight.js requiremets. SEO optimisation would also be necessary
Pagination would be nice to have as well. 
