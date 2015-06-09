// (server-side)
Meteor.startup(function() {
  // By default, the email is sent from no-reply@meteor.com. If you wish to receive email from users asking for help with their account, be sure to set this to an email address that you can receive email at.
  Accounts.emailTemplates.from = '智慧农场<no-reply@zhihui.farm>';

  // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
  Accounts.emailTemplates.siteName = '智慧农场';

  // A Function that takes a user object and returns a String for the subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return '验证你的电子邮件地址';
  };

  // A Function that takes a user object and a url, and returns the body text for the email.
  // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return '请点击以下链接来验证您的电子邮件地址, 验证成功后，系统将自动登陆: ' + url;
  };

  Accounts.emailTemplates.resetPassword.subject= function(user) {
    return '重新设置密码';
  };
  Accounts.emailTemplates.resetPassword.text= function(user, url) {
    return '请点击以下链接来重新设置您的密码: ' + url;
  };

});
