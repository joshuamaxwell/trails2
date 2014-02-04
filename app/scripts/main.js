//Replace the following two urls with our desired icon urls for favorite or not favorite
var favoriteFalse = 'images/fire.svg'
var favoriteTrue = 'images/firegold.svg'

var users = [{
    name: "Billy Joe",
    location: "Table Top Rock",
    avatar: "http://www.lorempixel.com/150/150/people/3",
}, {
    name: "Sally Milly",
    location: "Bald Face Pointe",
    avatar: "http://www.lorempixel.com/150/150/people/4",
}, {
    name: "Mindy Mills",
    location: "Cresent Head Bluff",
    avatar: "http://www.lorempixel.com/150/150/people/5",
}, {
    name: "Jilly Blithe",
    location: "Crappy Creek",
    avatar: "http://www.lorempixel.com/150/150/people/6",
}, {
    name: "Art Toms",
    location: "Pointy Bald Table Bluff",
    avatar: "http://www.lorempixel.com/150/150/people/7",
}];

var locations = [
    "Table Top Rock",
    "Bald Face Pointe",
    "Cresent Head Bluff",
    "Crappy Creek",
    "Pointy Bald Table Bluff",
]

var messages = [
    "What a beautiful view up here!",
    "[selfie!]",
    "We can't wait to visit this place again",
    "I def give this place 8 thumbs up",
    "Hey! Why aren't you here with me!?",
    "I'm never coming back here again in my life ever",
    "Smores! #BFFL",
    "Please help, I've been treed by a bear.",
]


var UserProfile = function(object) {
    this.userID = _.uniqueId('user');
    this.name = object.name;
    this.location = object.location;
    this.avatar = object.avatar;
    this.numTweets = 0;
    this.following = [];
    this.trails = [];
}

userArray = [];


var Tweet = function(userProfile) {
    this.tweetID = _.uniqueId('tweet');
    this.name = userProfile.name;
    this.userID = userProfile.userID;
    this.location = $('.sharelocation').val();
    this.msg = $('.share').val();
    this.avatar = userProfile.avatar;
    this.isFavorite = favoriteFalse;
    this.date = new Date();
    this.time = tweetTimeFormat(this.date);
};

tweetArray = [];


//set up the template functions to use with making new tweets markup to prepend to our .tweets div
//and to add users to our .profile-chooser
var postTemplate = _.template($('.tweet-template').text());
var userRowTemplate = _.template($('.profile-chooser-template').text());



// these are three lines of code that take all the basic user info in 
// the users array and makes proper UserProfiles out of them
// then pushes them onto the userArray

_.each(users, function(user) {
    registerNewUser(user);
});
// give the example users a certain number of tweets
_.each(userArray, function(e) {
    e.numTweets = _.random(400); //give each example user a random number of tweets to START from
    var locationsVisited = _.sample(locations, _.random(locations.length)); // give each user a random number of locaitons they've visited
    _.each(locationsVisited, function(location) {
        e.trails.push(location);
    });
    var following = _.sample(userArray, _.random(userArray.length));
    _.each(following, function(user) {
        e.following.push(user.userID);
    });
});

// fill up the page with sample data
populateStream(50);

// set the current user to a random example user
var currentUser = setCurrentUser(_.sample(userArray));

// here begins the javascript to change the current profile upon clicking the name in the list
$(document).on('click', '.profile-chooser', function() {
    $('.profile-chooser > ul').toggleClass('hidden');
});

$(document).on('click', 'li.profile-chooser-row', function() {
    var clickedUserID = $(this).attr("id");
    console.log(clickedUserID);
    var clickedUser = _.find(userArray, function(e) {
        return e.userID == clickedUserID;
    });
    setCurrentUser(clickedUser);
});



//I had to switch to $(document).on() for click events because .click() only works if the content
//is on the page already
$(document).on('click', '.sharebutton', function() {
    var tweet = new Tweet(currentUser);
    tweetArray.push(tweet);
    $('.tweets').prepend(postTemplate(tweet));
    $('.share').val('');
    ++currentUser.numTweets;
    $('.tweetnum > .num').text(currentUser.numTweets);
});

//All of this javascript is to mark the tweets as favoriteTrue or favoriteFalse in both the DOM and the array
$(document).on('click', '.isFavorite', function() {
    console.log("click");
    if ($(this).attr("src") == favoriteFalse) {
        console.log($(this).attr("src"));
        $(this).attr("src", favoriteTrue);
        var tweetID = $(this).parents('.tweet').attr("id");
        console.log("you clicked: ", tweetID);
        _.each(tweetArray, function(e) {
            if (e.tweetID == tweetID) {
                e.isFavorite = favoriteTrue;
            }
        })
    } else {
        $(this).attr('src', favoriteFalse);
        console.log($(this).attr("src"));
        var tweetID = $(this).parents('.tweet').attr("id");
        _.each(tweetArray, function(e) {
            if (e.tweetID == tweetID) {
                e.isFavorite = favoriteFalse;
            }
        })
    }
});


function populateStream(num) {
    for (i = 0; i < num; i++) {
        randomUser = _.sample(userArray);
        var tweet = new Tweet(randomUser);
        tweet.msg = _.sample(messages);
        tweet.location = _.sample(locations);
        tweetArray.push(tweet);
        $('.tweets').prepend(postTemplate(tweet));
        ++randomUser.numTweets;
    }
}

function setCurrentUser(user) {
    currentUser = user;
    $('.tweetnum > .num').text(user.numTweets);
    $('.following > .num').text(user.following.length);
    $('.locations > .num').text(user.trails.length);
    $('.profpic img').attr("src", user.avatar);
    $('.profname').text(user.name);
    $('.proflocation').text(user.location);
    $('.sharelocation').val(user.location);
    $('.profile-chooser > .avatar > img').attr("src", user.avatar);
    $('.profile-chooser > .name').text(user.name);
    return user;
}

function tweetTimeFormat(date) {
    hours = date.getHours();
    if (hours < 10)
        hours = '0' + hours;
    minutes = date.getMinutes();
    if (minutes < 10)
        minutes = '0' + minutes;
    return hours + ":" + minutes;
}

function registerNewUser(user) {
    newUser = new UserProfile(user);
    userArray.push(newUser);
    $('.profile-chooser-rows').append(userRowTemplate(newUser));
}
