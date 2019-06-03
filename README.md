[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Templates for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Sample project: Dice Championship (MySQL integration)

This sample project uses MySQL databases (via the Jovo framework's `jovo-db-mysql` integration) for storing both <a href="https://www.jovo.tech/docs/data/user">user data</a> and - probably more interestingly - highscores. Highscores are a neat way to create indirect interactions between user, and can potentially increase retention of a voice game.

This sample project uses an <a href="https://console.aws.amazon.com/rds/home">AWS RDS</a> MySQL database, but it doesn't matter where your MySQL instance is actually hosted.

In case you want to do it with RDS, here's a quick guide to get you started with a <a href="https://aws.amazon.com/rds/free/">free usage tier</a> instance:

## Setting up AWS RDS

1. Log into the AWS Management Console and navigate to <a href="https://console.aws.amazon.com/rds/home">AWS RDS Home</a>.
2. Click the orange button "Create Database"
3. In the "Select engine" dialog, select "MySQL", enable the checkbox "Only enable options eligible for RDS Free Usage Tier" on the bottom, and click on the orange button "Next"
4. In the "Specify DB details", skip down to "Settings" and assign your DB instance an identifier (e.g. `mydemodbinstance`), master username and password
5. In the "Configure advanced settings" dialog, select the "Virtual Private Cloud (VPC)" option "Create new VPC", make sure that "Public accessibility" is on "Yes", assign a database name (e.g. `mydemodb`), and then skip to the bottom and click on the orange button "Create database".
6. Check out the confirmation page and then check out the DB instance details. After some minutes, a URI will appear under "Connect > Endpoint".

## Set up credentials in the project

After you cloned this repo, rename the file `.env.example` to `.env` and complete it with your DB credentials:
```
MYSQL_ADDR='localhost' <-- The endpoint of your DB instance (from step 6)
MYSQL_PORT='9000' <-- The port of your DB instance, typically '3306'
MYSQL_USER='user' <-- The master username for your DB instance (from step 4)
MYSQL_PASSWORD='password'  <-- The password for your DB instance (from step 4)
MYSQL_DATABASE='jovoapp' <-- The DB name from step 5
```

## Setting up the highscore table

Unlike the user database, the voice app will not automatically create a table for the highscores, so you have to set it up yourself. Here's how you can do it on the MySQL ommand-Line Client (please replace the `<VARIABLE>` fields with the equivalent value from the previous point): 

```
mysql -h <MYSQL_ADDR> -P <MYSQL_PORT> -u <MYSQL_USER> -p <MYSQL_DATABASE>
[Enter your password at that point]

CREATE TABLE scores (
    id INT(11) NOT NULL AUTO_INCREMENT,
    score INT,
    PRIMARY KEY (id)
);
```

# What the voice app does

The mechanics of the voice app are very simple:

1.  You launch the voice app
2.  It rolls 6 6-sided dice and adds their face values to a score
3.  It queries the `scores` table to count how often a higher score has been recorded
4.  It presents the score to the user, along with a note whether they are the highest-scoring user, or else, which rank they have
5.  It asks the user if they want to roll again
6.  If the user accepts, the voice app restarts the game cycle at item 2 of this list, otherwise is quits the Skill

