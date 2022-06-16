module.exports = require('passport').authenticate('local',{
    successRedirect:'/pages',
    failureRedirect:'/users/login',
    failureFlash: true,
    successFlash: "Successfully logged in!"
}); 