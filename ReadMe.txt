Part 1 implemented. There is a div of 7 clickable buttons on the top which correspond to a 2D array on the server side. Below there are several
divs of unclickble buttons, which act as the display.

Most of Part 2 implemented. Game works only for 2 players. Run the server first, then open one tab. It will wait for another user. Then open the other tab.
Then the game will start. Sometimes this gets bugged for some reason. To fix this, just close these tabs and restart the server and then open
the two tabs again.

I used an algorithm for the game rules from: https://codereview.stackexchange.com/questions/127091/java-connect-four-four-in-a-row-detection-algorithms
All possible winning combinations are implemented. When one player wins, both players are notified about who has won.

Once the game is won, to restart the game, you will need close the tabs and restart the server again. For some reason, simply refreshing the
page did not update the board. So just restart the server and reopen the tabs to play again. 

Also, if one player leaves midway during a game, and then another player connects, the game gets bugged. The fix again is to close the tabs and
restart the server and then reopen the tabs. 

20100006