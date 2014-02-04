var Request = require('request');

var Ricoptcha = module.exports = function Ricoptcha(publicKey, privateKey, theme, data){
    if(theme && 'redwhiteblackglassclean'.indexOf(theme) > -1){
        this.widget = Ricoptcha.prototype._themeScript.replace(/{{theme}}/g, theme).replace(/{{themeScriptCustom}}/, '');
        this.widget += Ricoptcha.prototype._widgetScript.replace(/{{recaptchaPublicKey}}/g, publicKey);
    }else if(theme){
        this.widget = Ricoptcha.prototype._themeScript.replace('{{theme}}', 'custom').replace(/{{themeScriptCustom}}/, Ricoptcha.prototype._themeScriptCustom);
        this.widget += Ricoptcha.prototype._customWidget.replace(/{{recaptchaPublicKey}}/g, publicKey);
    }else{
        this.widget = Ricoptcha.prototype._widgetScript.replace(/{{recaptchaPublicKey}}/g, publicKey);
    }

    this.widget += Ricoptcha.prototype._noscript.replace(/{{recaptchaPublicKey}}/g, publicKey);
};

Ricoptcha.prototype._widgetScript = '<script type="text/javascript" src="http://www.google.com/recaptcha/api/challenge?k={{recaptchaPublicKey}}"></script>'
Ricoptcha.prototype._themeScript = '<script type="text/javascript">var RecaptchaOptions = {theme : "{{theme}}"{{themeScriptCustom}}};</script>';
Ricoptcha.prototype._themeScriptCustom = ',custom_theme_widget: "recaptcha_widget"';
Ricoptcha.prototype._customWidget = '\
        <div id="recaptcha_widget" style="display:none">\
            <div id="recaptcha_image"></div>\
            <div class="recaptcha_only_if_incorrect_sol" style="color:red">Incorrect please try again</div>\
\
            <span class="recaptcha_only_if_image">Enter the words above:</span>\
            <span class="recaptcha_only_if_audio">Enter the numbers you hear:</span>\
\
            <input type="text" id="recaptcha_response_field" name="recaptcha_response_field" />\
\
            <div><a href="javascript:Recaptcha.reload()">Get another CAPTCHA</a></div>\
            <div class="recaptcha_only_if_image"><a href="javascript:Recaptcha.switch_type("audio")">Get an audio CAPTCHA</a></div>\
            <div class="recaptcha_only_if_audio"><a href="javascript:Recaptcha.switch_type("image")">Get an image CAPTCHA</a></div>\
\
            <div><a href="javascript:Recaptcha.showhelp()">Help</a></div>\
        </div>\
        <script type="text/javascript" src="http://www.google.com/recaptcha/api/challenge?k={{recaptchaPublicKey}}"></script>';
Ricoptcha.prototype._noscript = '<noscript>\
        <iframe src="http://www.google.com/recaptcha/api/noscript?k={{recaptchaPublicKey}}"\
            height="300" width="500" frameborder="0"></iframe><br>\
        <textarea name="recaptcha_challenge_field" rows="3" cols="40">\
        </textarea>\
        <input type="hidden" name="recaptcha_response_field"\
            value="manual_challenge">\
        </noscript>';

Ricoptcha.prototype.isValid = function(data, callback){
    Request.post('http://www.google.com/recaptcha/api/verify', {form:data}, function (error, response, body) {
        var bodyParts = body.split('\n');
        var errors = bodyParts[1];

        if(bodyParts[0] === 'true'){
            errors = null;
        }

        callback(errors);
    });
};